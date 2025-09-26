pragma solidity ^0.8.20;

contract NewFeature {
    uint public myNumber;
    // Initial content for the new feature contract

    function setMyNumber(uint _newNumber) public {
        myNumber = _newNumber;
    }

    function updateMyNumber(uint _numberToSet) public {
        setMyNumber(_numberToSet);
    }

    address public owner;

    event NumberUpdated(uint oldNumber, uint newNumber);

    function setOwner(address _newOwner) public {
        owner = _newOwner;
    }
}
