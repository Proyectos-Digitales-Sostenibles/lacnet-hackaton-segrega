pragma solidity >=0.8.0 <0.9.0;

import "./BaseRelayRecipient.sol";

/**
 * @title HashValidator
 * @dev Store & retreive latest segrega app accumulated transaction hash
 */
contract HashValidator is BaseRelayRecipient{

    string valueHash;
    address owner;

    constructor() {
        owner = _msgSender();
    }

    /**
     * @dev Store value in variable
     * @param newValueHash hash string to store
     */
    function store(string memory newValueHash) public {
        valueHash = newValueHash;

        emit ValueSeted(_msgSender(), newValueHash);
    }

    /**
     * @dev Return value
     * @return value of 'valueHash'
     */
    function retreive() public view returns (string memory){
        return valueHash;
    }

    function getOwner() public view returns (address){
        return owner;
    }

    event ValueSeted(address sender, string value);
}