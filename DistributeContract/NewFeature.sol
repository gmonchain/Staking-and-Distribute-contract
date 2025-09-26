pragma solidity ^0.8.20;

contract NewFeature {
    uint public myNumber;
    // Initial content for the new feature contract

    function setMyNumber(uint _newNumber) public {
        uint oldNumber = myNumber;
        myNumber = _newNumber;
        emit NumberUpdated(oldNumber, newNumber);
    }

    function updateMyNumber(uint _numberToSet) public {
        setMyNumber(_numberToSet);
    }

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    event NumberUpdated(uint oldNumber, uint newNumber);

    function setOwner(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be the zero address");
        owner = _newOwner;
    }
}
