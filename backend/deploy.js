import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
const url = "https://sepolia.infura.io/v3/7997091568f840f79ae9d88321a8dc1f";
import { compile } from 'solc';

// Load the contract source code
const contractSource = readFileSync(join(__dirname, 'M.sol'), 'utf8');

// Compile the contract
const compiledContract = compile(contractSource, 1).contracts[':M'];

// Generate ABI and Bytecode
const abi = compiledContract.abi;
const bytecode = compiledContract.bytecode;

// Save the ABI and Bytecode to files
writeFileSync(join(__dirname, 'MyContractAbi.json'), JSON.stringify(abi));
writeFileSync(join(__dirname, 'M_sol_M.bin'), bytecode);

