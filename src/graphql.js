import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Navbar  from './components/navbar';
import web3 from 'web3';
import { useNavigate } from "react-router-dom";
const GraphQLPage = () => {
  const [account, setAccount] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Assuming you have a way to get the current account
    // This is just a placeholder, replace with your actual method
    const fetchAccount = async () => {
      // Replace this with your actual method to get the account
      const currentAccount = '0x5aD439688E4a5f2E13Af800938452EA945858598'; // Example account
      setAccount(currentAccount);
    };

    fetchAccount();
  }, []);

  const INSTR_QUERY = gql`
    query MyQuery($destination: Bytes!) {
      instrSents(first: 10, where: { destination: $destination }) {
        destination
        sender
        indsx
        content
        timestamp
        transactionHash
        
      }
      instrReads(first: 10) {
        blockTimestamp
        destination
        sender
        indx
        timestamp
        transactionHash
      }
    }
  `;
  const accountBytes = web3.utils.toHex(account);
  console.log(accountBytes,account);
  const { loading, error, data } = useQuery(INSTR_QUERY, {
    variables: { destination: account },
    skip: !account, // Skip the query if account is not set
  });
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Navbar />
      <h1>GraphQL Query Results</h1>
      {data && data.instrSents && (
        <><ul>
          <h2>Sent Instructions</h2>
          {data.instrSents.map((instr, index) => (
            <li key={index}>
              <p>Sender: {instr.sender}</p>
              <p>Destination: {instr.destination}</p>
              <p>Content: {instr.content}</p>
              <p>Timestamp: {new Date(parseInt(instr.timestamp) * 1000).toLocaleString()}</p>
              <p>Transaction Hash: {instr.transactionHash}</p>
            </li>
          ))}
        </ul><ul>
          <h2>Read Instructions</h2>
            {data.instrReads.map((instr, index) => (
              <li key={index}>
                <p>Sender: {instr.sender}</p>
                <p>Destination: {instr.destination}</p>
                <p>Timestamp: {new Date(parseInt(instr.timestamp) * 1000).toLocaleString()}</p>
                  <p>Block Timestamp: {new Date(parseInt(instr.blockTimestamp) * 1000).toLocaleString() }</p>
                <p>Transaction Hash: {instr.transactionHash}</p>
              </li>
            ))}
          </ul></>
      )}
    </div>
  );
};

export default GraphQLPage;
