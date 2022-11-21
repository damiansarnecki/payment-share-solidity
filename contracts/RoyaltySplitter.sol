// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RoyaltySplitter is Ownable {
    address[] public recipients;
    mapping(address => uint256) private _percentages;

    uint256 immutable _maxRecipients;
    uint256 private _percentageSum = 0;
    uint256 _recipientsCount = 0;

    constructor(uint256 maxRecipients_) {
        _maxRecipients = maxRecipients_;
    }

    function addRecipient(address recipient, uint256 percentage)
        public
        onlyOwner
    {
        require(
            percentage + _percentageSum <= 100,
            "Sum of fee percentages can't be over 100%"
        );
        require(_recipientsCount < _maxRecipients, "Recipient limit reached");
        require(_percentages[recipient] == 0, "Recipient already in array");

        recipients.push(recipient);
        _percentages[recipient] = percentage;

        _percentageSum += percentage;
        _recipientsCount += 1;
    }

    function deleteRecipient(uint256 recipientIndex) public onlyOwner {
        require(recipientIndex <= recipients.length - 1, "Invalid index");

        address recipient = recipients[recipientIndex];
        recipients[recipientIndex] = recipients[recipients.length - 1];
        recipients.pop();

        _percentages[recipient] = 0;
    }

    function setPercentage(address recipient, uint256 newPercentage)
        public
        onlyOwner
    {
        require(
            _percentageSum + (newPercentage - _percentages[recipient]) <= 100,
            "Sum of fee percentages can't be over 100%"
        );
        require(newPercentage > 0, "Can't set percentage to 0");

        _percentageSum += (newPercentage - _percentages[recipient]);
        _percentages[recipient] = newPercentage;
    }

    function getPercentage(address recipient) external view returns (uint256) {
        return _percentages[recipient];
    }

    function getRecipientIndex(address recipient) public view returns (int256) {
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == recipient) return int256(i);
        }
        return -1;
    }

    receive() external payable {
        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            (bool success, ) = address(recipient).call{
                value: (msg.value * _percentages[recipient]) / 100
            }("");

            require(success, "RoyaltySplitter: Transaction reverted");
        }
    }

    function withdraw() external onlyOwner {
        (bool success, ) = address(msg.sender).call{value: address(this).balance}("");
        require(success, "RoyaltySplitter: Transaction reverted");
    }
}
