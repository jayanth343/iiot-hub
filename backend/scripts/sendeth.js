const { Web3 } = require("web3");
const Eth = require("web3-eth");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const { timeStamp, count } = require("console");
const readlineSync = require("readline-sync");
const readline = require("readline");
const GAS = 1000000;
const GASPRICE = "10000000000";
const url = "http://127.0.0.1:8545/";
const web3 = new Web3(url);


const dst = '0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C';
const src = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const eth = '5000';
const amountInWei = web3.utils.toWei(eth, 'ether');

async function main() {

  // create a new Web3.js account object with the private key of a Hardhat test account
  const privateKey = "<redacted>";
  // the account is created with a wallet, which makes it easier to use
  const sender = web3.eth.accounts.wallet.add('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');

  // generate a new random Web3.js account object to receive the transaction
  const receiver = web3.eth.accounts.create();

  // log initial balances
  console.log(
    "Initial sender balance:",
    // account balance in wei
    await web3.eth.getBalance(sender.address)
  );
  console.log(
    "Initial receiver balance:",
    // account balance in wei
    await web3.eth.getBalance(dst)
  );

  // sign and send the transaction
  const receipt = await web3.eth.sendTransaction({
    from: sender.address,
    to: dst,
    // amount in wei
    value: amountInWei,
  });

  // log transaction receipt
  console.log(receipt);

  // log final balances
  console.log(
    "Final sender balance:",
    await web3.eth.getBalance(sender.address)
  );
  console.log(
    "Final receiver balance:",
    await web3.eth.getBalance(dst)
  );
}

main();