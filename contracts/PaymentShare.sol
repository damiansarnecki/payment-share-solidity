// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PaymentShare is Ownable {
    using Counters for Counters.Counter;

    address[] public shareholders;
    uint256 private immutable _maxShareholders;
    Counters.Counter public _shareholdersCount;

    mapping(address => uint256) private _sharePercentages;
    uint256 private _shareSum = 0;

    constructor(uint256 maxShareholders_) {
        _maxShareholders = maxShareholders_;
    }

    function getMaxShareholders() external view returns (uint256) {
        return _maxShareholders;
    }

    function addShareholder(address user, uint256 sharePercentage)
        public
        onlyOwner
    {
        require(
            sharePercentage + _shareSum <= 100,
            "PaymentShare: Sum of fee percentages can't be over 100%"
        );
        require(
            _shareholdersCount.current() < _maxShareholders,
            "PaymentShare: Recipient limit reached"
        );
        require(sharePercentage > 0, "PaymentShare: Can't set percentage to 0");
        require(
            _sharePercentages[user] == 0,
            "PaymentShare: Recipient already in array"
        );

        shareholders.push(user);
        _sharePercentages[user] = sharePercentage;

        _shareSum += sharePercentage;
        _shareholdersCount.increment();
    }

    function deleteShareholderByIndex(uint256 userIndex) public onlyOwner {
        require(userIndex < shareholders.length, "PaymentShare: Shareholder index doesn't exists");

        address user = shareholders[userIndex];
        shareholders[userIndex] = shareholders[shareholders.length - 1];
        shareholders.pop();

        _sharePercentages[user] = 0;
        _shareholdersCount.decrement();
    }

    function deleteShareholderByAddress(address user) public onlyOwner {
        int256 userIndex = getShareholderIndex(user);
        require(userIndex >= 0, "Invalid index");

        deleteShareholderByIndex(uint256(userIndex));
    }

    function setShare(address user, uint256 newPercentage) public onlyOwner {
        require(
            _shareSum + (newPercentage - _sharePercentages[user]) <= 100,
            "PaymentShare: Sum of fee percentages can't be over 100%"
        );
        require(newPercentage > 0, "PaymentShare: Can't set percentage to 0");

        _shareSum += (newPercentage - _sharePercentages[user]);
        _sharePercentages[user] = newPercentage;
    }

    function getShare(address user) external view returns (uint256) {
        return _sharePercentages[user];
    }

    function getShareholderIndex(address user) public view returns (int256) {
        for (uint256 i = 0; i < shareholders.length; i++) {
            if (shareholders[i] == user) return int256(i);
        }
        return -1;
    }

    receive() external payable {
        for (uint256 i = 0; i < shareholders.length; i++) {
            address shareholder = shareholders[i];
            (bool success, ) = address(shareholder).call{
                value: (msg.value * _sharePercentages[shareholder]) / 100
            }("");

            require(success, "PaymentShare: Transaction reverted");
        }
    }

    function withdraw() external onlyOwner {
        (bool success, ) = address(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "PaymentShare: Transaction reverted");
    }
}
