const { Web3 } = require('web3');
const Eth = require('web3-eth');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv').config();
const url = 'https://sepolia.infura.io/v3/7997091568f840f79ae9d88321a8dc1f';
const web3 = new Web3(url);
const abi = require('./MyContractAbi.json');
//const bytecode = require('./MyContractBytecode.bin');
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const CONTRACT_ADDRESS = '0xd8630A5c2e7e5bDeeBE2F967caA18dB6f20F9Bd1';
const myContract = new web3.eth.Contract(
    abi,CONTRACT_ADDRESS
);
const acc = '0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C';
const acc2 = '0x5aD439688E4a5f2E13Af800938452EA945858598';

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
      sender: acc2
    },
    fromBlock: 0,
    toBlock: 'latest'
  };
  console.log('Getting events');
    const events = await myContract.getPastEvents('InstrSent',options);
    console.log('InstrSent events:\n',events);
  
}

async function main() {
  try {
    const transaction = await myContract.methods.isVerified(acc2, acc2).encodeABI();
    const gasEstimate = await myContract.methods.isVerified(acc2, acc2).estimateGas({ from: acc2 });
    
    const tx = {
      from: acc2,
      to: myContract.options.address,
      gas: gasEstimate,
      gasPrice: await web3.eth.getGasPrice(), // Add gasPrice
      data: transaction
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, 'b765077249a3ae2b5230c72ace803261c99b06d7dbf4c3a5616bf8b14eff7069');
    const r = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('isVerified:', r);
  } catch (error) {
    console.error('Error calling isVerified:', error.message);
  }
}
async function getNodeStatusEvents() {
  const options = {
    fromBlock: 0,
    toBlock: 'latest'
  };

  console.log('Retrieving NodeStatus events...');
  try {
    const events = await myContract.getPastEvents('NodeStatus', options);
    console.log('NodeStatus events:',events);

    
  } catch (error) {
    console.error('Error retrieving NodeStatus events:', error.message);
  }
}

// Call the function to retrieve and print NodeStatus events
//getNodeStatusEvents();

//main();


// ss();


async function readInstruction(src, dest, index) {
  try {
    const instrList = await myContract.methods.getInstr().call({from: src});
    console.log("Instruction List for src:", instrList);

    const transaction = myContract.methods.instrRead(src, dest, index).encodeABI();    
    const tx = {
      from: dest,
      to: myContract.options.address,
      
      data: transaction
    };

    // Replace 'YOUR_PRIVATE_KEY' with the actual private key of the 'dest' account
    const signedTx = await web3.eth.accounts.signTransaction(tx, '0xb765077249a3ae2b5230c72ace803261c99b06d7dbf4c3a5616bf8b14eff7069');
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log('Transaction receipt:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error reading instruction:', error.message);
    throw error;
  }
}

// Example usage:
// readInstruction('0x1234...', '0x5678...', 0)
//   .then(receipt => console.log('Transaction receipt:', receipt))
//   .catch(error => console.error('Error:', error));

readInstruction(acc, acc2, 0);

