// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemeToken is ERC20 {
    constructor() ERC20("Meme Token", "MEME") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
