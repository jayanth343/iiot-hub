import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "./App.css";
import Home from "./Home";
import Dashboard from "./dashboard";
import D2 from "./d2";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Alert, Button, Chip } from "@mui/material";
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
import  useStore  from "./store";
function Dash() {
  const navigate = useNavigate();
  const account = useStore((state) => state.account);
  const balance = useStore((state) => state.balance);
  const accounts = useStore((state) => state.accounts);
  const setAccount = useStore((state) => state.setAccount);
  const setBalance = useStore((state) => state.setBalance);
  const setAccounts = useStore((state) => state.setAccounts);
  const contractAddress = useStore((state) => state.contractAddress);
  const myContract = useStore((state) => state.myContract);


  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);

          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          const balanceWei = await web3.eth.getBalance(accounts[0]);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(balanceEth);
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
          }); 
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    connectWallet();


    const accounts = [


      "0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C",
      "0x5aD439688E4a5f2E13Af800938452EA945858598",
    ];
    setAccounts(accounts);
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", connectWallet);
      }
    };
  }, []);




  return (
    <>
      <Navbar
      account={account}
      balance={balance}
      />
      <D2 />
      <style>
        {`
        body, #root {
          background-color: #2C2D2A;
          color: white;
        }
        .MuiPaper-root:not(.MuiAppBar-root), .MuiMenu-paper {
          background-color: #2C2D2A !important;
          color: white !important;
        }
        .MuiTypography-root:not(.MuiAppBar-root *), 
        .MuiMenuItem-root:not(.MuiAppBar-root *), 
        .MuiListItemText-primary:not(.MuiAppBar-root *), 
        .MuiListItemText-secondary:not(.MuiAppBar-root *),
        .MuiButton-root:not(.MuiAppBar-root *) {
          color: white !important;
        }
        .MuiIconButton-root:not(.MuiAppBar-root *) {
          color: white;
        }
        .MuiSnackbarContent-root {
          background-color: #2C2D2A !important;
          color: white !important;
        }
        .MuiAlert-standardInfo {
          background-color: rgba(33, 150, 243, 0.1) !important;
          color: white !important;
        }
      `}
      </style>
    </>
  );
}

export default Dash;
