const { Web3 } = require("web3");
const Eth = require("web3-eth");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv").config();
const url = "https://sepolia.infura.io/v3/7997091568f840f79ae9d88321a8dc1f";
const web3 = new Web3(url);
const abi = require("./MyContractAbi.json");
//const bytecode = require("./MyContractBytecode.bin");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const myContract = new web3.eth.Contract(
  abi,'0x010F1493ffcF40CEB9E20C260245f0d049E5E049'
);
const acc = "0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C";
const acc2 = "0x5aD439688E4a5f2E13Af800938452EA945858598";

const TypesArray = [
  {type: 'address', name: 'source'}, 
    {type: 'address', name: 'destination'},
    {type: 'string', name: 'res'},

];
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

async function main() {
  try {
    const transaction = await myContract.methods.isVerified(acc, acc2).encodeABI();
    const gasEstimate = await myContract.methods.isVerified(acc, acc2).estimateGas({ from: acc });
    
    const tx = {
      from: acc,
      to: myContract.options.address,
      gas: gasEstimate,
      gasPrice: await web3.eth.getGasPrice(), // Add gasPrice
      data: transaction
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, 'b765077249a3ae2b5230c72ace803261c99b06d7dbf4c3a5616bf8b14eff7069');
    const r = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("isVerified:", r);
  } catch (error) {
    console.error("Error calling isVerified:", error.message);
  }
}
async function getNodeStatusEvents() {
  const options = {
    fromBlock: 0,
    toBlock: 'latest'
  };

  console.log("Retrieving NodeStatus events...");
  try {
    const events = await myContract.getPastEvents('NodeStatus', options);
    console.log("NodeStatus events:",events);

    
  } catch (error) {
    console.error("Error retrieving NodeStatus events:", error.message);
  }
}

// Call the function to retrieve and print NodeStatus events
//getNodeStatusEvents();
console.log("True: ",web3.utils.keccak256("true"));
console.log("False: ",web3.utils.keccak256("false"));
//main();


// ss();

