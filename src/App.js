import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import moment from 'moment';
import './App.css';
const abi = require("./contracts/MyContractAbi.json");
 // Add your contract abi here
const CONTRACT_ADDRESS = '0x7dd293878a835265A23465f6E4402C4f37eA7580'; // Add your contract address here

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [nodeList, setNodeList] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');

  useEffect(() => { 
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const contractInstance = new web3Instance.eth.Contract(abi, CONTRACT_ADDRESS);
          setContract(contractInstance);
          loadNodeList(contractInstance, accounts[0]);
          loadInstructions(contractInstance, accounts[0]);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
      }
    };

    initWeb3();
  }, []);

  const loadNodeList = async (contractInstance, account) => {
    const result = await contractInstance.methods.alCount(account).call();
    setNodeList(result[0]);
  };

  const loadInstructions = async (contractInstance, account) => {
    const result = await contractInstance.methods.getInstr().call();
    setInstructions(result);
  };

  const sendInstruction = async () => {
    if (!selectedDestination || !newInstruction) return;
    await contract.methods.sendInstr(selectedDestination, newInstruction).send({
      from: account,
      gas: 1000000,
      gasPrice: '10000000000'
    });
    loadInstructions(contract, account);
    setNewInstruction('');
  };

  const readInstruction = async (destination, index) => {
    await contract.methods.instrRead(destination).send({
      from: account,
      gas: 1000000,
      gasPrice: '10000000000'
    });
    loadInstructions(contract, account);
  };

  return (
    <div className="App">
      <h1>Dashboard</h1>
      <p>Connected Account: {account}</p>

      <h2>Node List</h2>
      <ul>
        {nodeList.map((node, index) => (
          <li key={index}>{node.addr} - Access: {node.access ? 'Yes' : 'No'}</li>
        ))}
      </ul>

      <h2>Send Instruction</h2>
      <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
        <option value="">Select Destination</option>
        {nodeList.filter(node => node.access).map((node, index) => (
          <option key={index} value={node.addr}>{node.addr}</option>
        ))}
      </select>
      <input 
        type="text" 
        value={newInstruction} 
        onChange={(e) => setNewInstruction(e.target.value)} 
        placeholder="Enter instruction"
      />
      <button onClick={sendInstruction}>Send</button>

      <h2>Instructions</h2>
      <ul>
        {instructions.map((instr, index) => (
          <li key={index}>
            To: {instr.destination} | 
            DateTime: {moment.unix(Number(instr.timestamp)).format('YYYY-MM-DD HH:mm:ss')} | 
            Content: {instr.content} | 
            Status: {instr.isRead ? 'Read' : 'Unread'}
            {!instr.isRead && (
              <button onClick={() => readInstruction(instr.destination, index)}>Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;