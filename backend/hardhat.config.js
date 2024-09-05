require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://sepolia.infura.io/v3/7997091568f840f79ae9d88321a8dc1f", // Replace with your Infura project ID
      accounts: ["b765077249a3ae2b5230c72ace803261c99b06d7dbf4c3a5616bf8b14eff7069"] // Use environment variable for private key
    }
  },etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "KWAH37TC1S9GYB2KEEZCCZE8R1UNAEU7SB"
  },
};
