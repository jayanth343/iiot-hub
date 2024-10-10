import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "./App.css";
import Navbar from "./components/navbar.jsx";
import BComponent from "./components/BComponent.jsx";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogContentText,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  DialogTitle,
  SvgIcon,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import BlurCircularIcon from "@mui/icons-material/BlurCircular";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useQuery, gql } from "@apollo/client";
import client from "./index.js";
import abi from "./contracts/MyContractAbi.json";
const NodeCommunication = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [instrSents, setInstrSents] = useState([]);
  const [instrReads, setInstrReads] = useState([]);
  const [blacklisteds, setBlacklisteds] = useState([]);
  const [nodeStatuses, setNodeStatuses] = useState([]);
  const [loadState, setLoadState] = useState(false);
  const [contractAddress, setContractAddress] = useState(null);
  const [verifdone, setverifdone] = useState(false);
  const [myContract, setMyContract] = useState(null);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  const COMB_QUERY = gql`
  query MyQuery {
  instrReads {
    destination
    sender
    indx
    timestamp
    transactionHash
  }
  instrSents {
    destination
    sender
    content
    indsx
    timestamp
    transactionHash
  }
  nodeStatuses {
    destination
    res
    source
    timestamp
    transactionHash
  }
  blacklisteds {
    destination
    sender
    timestamp
    transactionHash
    }
  }
  `;

  const nodeVerification = async (pa,a) => {
    setLoadState(true);
    console.log("From: ", pa);
    console.log("To: ", a);
    myContract.methods.isVerified(pa,a).send({
      from: account
    }).then((res) => {
      console.log("Transaction hash:", res.transactionHash);
      console.log("Gas used:", res.gasUsed);
      console.log("Block number:", res.blockNumber);
      setLoadState(false);
      setverifdone(true);
    }).catch((err) => {
    console.error("Error verifying node:", err);
    setLoadState(false);

  });

}

  const ReadQueryExec = async () => {
    try {
      const { data, error } = await client.query({
      query: COMB_QUERY,
      skip: !account,
    });
    console.log("Data:",data);
    await sleep(1000);
  
    setInstrReads(data.instrReads);
    setInstrSents(data.instrSents);
    setNodeStatuses(data.nodeStatuses);
    setBlacklisteds(data.blacklisteds);
    /*
    const { data3, error3 } = await client.query({
      query: NODE_STATUS_QUERY,
      variables: { destination: account },
      skip: !account,
    });
    setNodeStatuses(data3.nodeStatuses);
    const { data4, error4 } = await client.query({
      query: BL_QUERY,
      variables: { destination: account },
      skip: !account,
    });
    setBlacklisteds(data4.blacklisteds);
    */
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error.message) console.error("Error message:", error.message);
  }
  };
  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined" && !web3 && !account) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          const balanceWei = await web3.eth.getBalance(accounts[0]);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(parseFloat(balanceEth));
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
            console.log("Account Changed", accounts[0]);
          });
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      }
    };

    const initializeApp = async () => {
      await connectWallet();
      setContractAddress("0x417213E993FA352d287A1AeeFCD3B0E5F053DB97"); //0x48Cd6D14407c2a485Beb94dB437b689a2C3927bc
      if (web3 && account) {
        if (!myContract) {
          await initContract();
        }
      }
    };

    initializeApp().catch(console.error);

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", connectWallet);
      }
    };
  }, [web3, account]);

  const initContract = useCallback(async () => {
    console.log("Initializing Contract:\n", web3, contractAddress, myContract);
    if (web3 && contractAddress && !myContract) {
      try {
        const contract = new web3.eth.Contract(abi, contractAddress);
        console.log("Contract Initialized:\n", contract);
        setMyContract(contract);
        return Promise.resolve();
      } catch (error) {
        console.error("Error initializing contract:", error);
        if (error.message) console.error("Error message:", error.message);
        return Promise.reject(error);
      }
    }
  }, [web3, contractAddress, myContract]);

  
  useEffect(() => {
    
    ReadQueryExec();
  }, [instrReads]);
  return (
    <>
    <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#2C2D2A",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          color: "white",
          "& .MuiTypography-root": { color: "white" },
          "& .MuiIconButton-root": { color: "white" },
          "& .MuiSvgIcon-root": { color: "white" },
        }}
      />  
      <Navbar
        account={account}
        balance={balance}
        contractAddress={contractAddress}
        myContract={myContract}
      />
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100h",
          }}
        >
          <BComponent
            myContract={myContract}
            account={account}
            nodeVerification={nodeVerification}
            instructions={instrSents}
            nodeStatuses={nodeStatuses}
            blacklisteds={blacklisteds}
            readInstructions={instrReads}
          />
          {verifdone && (
            <Dialog open={verifdone} onClose={() => setverifdone(false)}>
              <DialogTitle>Verification Status</DialogTitle>
              <DialogContent>
                <DialogContentText>Verification done!</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setverifdone(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>

      </div>
      
    </>
  );
};

export default NodeCommunication;
