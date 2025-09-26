pragma solidity ^0.8.20;

contract NewFeature {
    uint public myNumber;
    uint public immutable creationTime;

    struct UserData {
        uint id;
        string name;
        bool active;
    }

    mapping(address => UserData) public users;

    mapping(address => uint) public balances;

    function setBalance(address _user, uint _amount) public onlyOwner {
        if (_amount == 0) {
            revert InvalidAmount(_amount);
        }
        uint oldBalance = balances[_user];
        balances[_user] = _amount;
        emit BalanceChanged(_user, oldBalance, _amount);
    }

    function getBalance(address _user) public view returns (uint) {
        return balances[_user];
    }

    function updateMyNumber(uint _numberToSet) public {
        _setNumberInternal(_numberToSet);
    }

    function _setNumberInternal(uint _newNumber) internal {
        uint oldNumber = myNumber;
        myNumber = _newNumber;
        emit NumberUpdated(oldNumber, newNumber);
    }

    address public owner;
    address payable public fundRecipient;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        creationTime = block.timestamp;
        fundRecipient = payable(msg.sender);
    }

    event NumberUpdated(uint oldNumber, uint newNumber);
    event BalanceChanged(address indexed user, uint oldBalance, uint newBalance);

    function setOwner(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be the zero address");
        owner = _newOwner;
    }

    function getCreationTime() public view returns (uint) {
        return creationTime;
    }

    receive() external payable {}

    function withdrawFunds() public onlyOwner {
        fundRecipient.transfer(address(this).balance);
    }

    function doSomethingRestricted() public {
        require(msg.sender == owner || msg.sender == fundRecipient, "Only owner or fund recipient can call this");
        // do something
    }

    function getInfo() public view returns (uint, address) {
        return (myNumber, owner);
    }

    fallback() external payable {}

    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    error InvalidAmount(uint amount);
}
