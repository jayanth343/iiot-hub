import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "./App.css";
import Navbar from "./components/navbar.jsx";
import { useQuery, gql } from "@apollo/client";
import client from "./index.js";
import InstructionsComponent from "./InstructionComponent";
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
import abi from "./contracts/MyContractAbi.json";
import { WindPower } from "@mui/icons-material";

const Instr = () => {
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const pages = ["Home","Access List", "Instructions", "Logs"];
  const settings = ["Profile", "Switch Account", "Logout"];
  const [loading, setLoading] = useState(false);
  const [markInstrRead, setmarkInstrRead] = useState(false);
  const [loadState, setLoadState] = useState(false);
  const [balance, setBalance] = useState(0.0);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [myContract, setMyContract] = useState(null);
  const [SelectedSameAcc, setSelectedSameAcc] = useState(false);
  const [anchorWallet, setAnchorWallet] = useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [ViewAcc, setViewAcc] = useState(false);
  const [ViewBal, setViewBal] = useState(false);
  const [sendingInstr, setSendingInstr] = useState(false);
  const [readInstr, setReadInstr] = useState([]);
  const [instruction, setInstruction] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();

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
    if (myContract && account) {
      getInstructions();
    }
  }, [myContract, account]);

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
    }
  `;

  const getInstructions = async () => {
    if (myContract && account && web3) {
      setLoading(true);
      try {
        const instr = await myContract.methods
          .getInstr()
          .call({ from: account });
        console.log("Instructions: ", instr);
        setInstructions(instr);
      } catch (error) {
        console.error("Error fetching instructions:", error);
        if (error.message) console.error("Error message:", error.message);
      }
      console.log("Getting Read Instructions");
      await fetchRead();
      if (readInstr.length == 0) {
        console.log("No Read Instructions");
        setLoading(false);
      } else {
        console.log("Read Instructions: ", readInstr);
        setLoading(false);
      }
    }
  };
  const fetchRead = async () => {
    const { l, data, error } = await client.query({
      query: INSTR_QUERY,
      variables: { destination: account },
      skip: !account,
    });
    setReadInstr(data.instrSents);
  };

  useEffect(() => {
    if (account) {
      fetchRead();
    }
  }, [account, readInstr]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setViewAcc(false);
    setViewBal(false);
    setSelectedSameAcc(false);
    setAnchorWallet(null);
  };

  const handleErrorOpen = () => {
    setOpen(true);
  };
  const handleErrClose = () => {
    setOpen(false);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleWalletMenu = (event) => {
    setAnchorWallet(event.currentTarget);
  };
  const handleWalletMenuClose = () => {
    setAnchorWallet(null);
    setViewAcc(false);
    setViewBal(false);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleInstrClose = () => {
    setSendingInstr(false);
    setInstruction("");
  };

  const handleClickA = () => {
    setViewAcc(true);
  };

  const handleClickB = () => {
    setViewBal(true);
  };
  const handleSwitchAccount = async () => {
    console.log("Switching Account");
    try {
      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Prompt user to switch accounts
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      // Reload the page after account switch
      window.location.reload();
    } catch (error) {
      console.error("Error switching accounts:", error);
      // You might want to show an error message to the user here
    }
  };
  const handleMarkRead = async (src, dest, indx) => {
    setLoadState(true);
    console.log(`Sending from ${account}`);

    console.log("Src: ", src);
    console.log("Dest: ", dest);
    console.log("Indx: ", indx);

    await myContract.methods
      .instrRead(src, dest, indx)
      .send({
        from: String(dest),
      })
      .then((res) => {
        console.log("Instruction marked as read: ", res);
        setLoadState(false);
        setmarkInstrRead(true);
      })
      .catch((err) => {
        console.log("Error marking instruction as read: ", err);
        setLoadState(false);
      });
  };
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
      />
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <InstructionsComponent
            myContract={myContract}
            instructions={instructions}
            loadState={loadState}
            readInstructions={readInstr}
            handleMarkRead={handleMarkRead}
            handleonSend={handleClose}
          />
        )}

        <Snackbar
          open={markInstrRead}
          autoHideDuration={3000}
          onClose={() => {
            setmarkInstrRead(false);
            window.location.reload();
          }}
          message="Instruction marked as read."
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: '50%',
              fontSize: '1.2rem',
            },
          }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => {
                setmarkInstrRead(false);
                window.location.reload();
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </>
  );
};

export default Instr;
