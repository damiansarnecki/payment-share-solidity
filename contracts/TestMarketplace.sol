// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TestMarketplace is Ownable {
    address _royaltyRecipient;
    uint256 price = 100;

    constructor(address royaltyRecipient) {
        _royaltyRecipient = royaltyRecipient;
    }

    mapping(address => uint256) itemsBought;

    function buy() external payable {
        require(msg.value >= price);
        itemsBought[msg.sender] += 1;

        (bool paymentSuccess, ) = address(_royaltyRecipient).call{value: price}(
            ""
        );
        require(paymentSuccess == true, "Transfer failed");

        (bool returnSuccess, ) = address(msg.sender).call{
            value: msg.value - price
        }("");
        require(returnSuccess == true, "Transfer failed");
    }
}
