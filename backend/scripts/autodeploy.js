const { Web3 } = require("web3");
const Eth = require("web3-eth");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv").config();
const url = "https://sepolia.infura.io/v3/7997091568f840f79ae9d88321a8dc1f";
const web3 = new Web3(url);
const abi = require("./MyContractAbi.json");
const bytecode = require("./MyContractBytecode.json");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const myContract = new web3.eth.Contract(
  abi
);
const acc = "0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C";

async function deployContract() {
  const contractDeployer = myContract.deploy({
    data: bytecode,
    arguments: [1],
  });
}

async function ss() {
  
  //const r = await myContract.methods.getInstr().call({ from: acc });

  //let a = r;
  const options = {
    filter: {
      sender: acc
    },
    fromBlock: 0,
    toBlock: 'latest'
  };
  console.log("Getting events");
    const events = await myContract.getPastEvents('InstrSent',options);
    console.log("InstrSent events:\n",events);
  
}

 ss();

