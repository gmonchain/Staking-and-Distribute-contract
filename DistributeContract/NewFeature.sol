pragma solidity ^0.8.20;

contract NewFeature {
    uint public myNumber;
    // Initial content for the new feature contract

    function setMyNumber(uint _newNumber) public {
        myNumber = _newNumber;
    }

    address public owner;
}
