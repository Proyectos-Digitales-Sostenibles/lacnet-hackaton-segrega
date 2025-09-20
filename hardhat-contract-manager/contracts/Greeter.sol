// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import './BaseRelayRecipient.sol';

contract Greeter is BaseRelayRecipient {

   address public owner;
   string public greeting = "Hello ";

   constructor() {
     owner = _msgSender();
   }

   function greetMe(string memory _name) public view returns (string memory) {
       return string(abi.encodePacked(greeting, _name));
   }
   function getOwner() public view returns(address){
     return owner;
   }

}