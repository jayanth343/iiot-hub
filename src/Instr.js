import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "./App.css";
import Home from "./Home";
import { useQuery, gql } from "@apollo/client";
import client from "./index.js";
import InstructionsComponent from "./InstructionComponent";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Dialog,
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

const Instr = () => {
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const pages = ["Home", "Instructions", "Logs"];
  const settings = ["Profile", "Logout"];
  const [loading, setLoading] = useState(false);
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
      setContractAddress("0x48Cd6D14407c2a485Beb94dB437b689a2C3927bc");
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
    console.log("Initializing Contract:\n",web3, contractAddress, myContract);
    if (web3 && contractAddress && !myContract) {
      try {
        const contract = new web3.eth.Contract(abi, contractAddress);
        console.log("Contract Initialized:\n",contract);
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
    handleWalletMenuClose();
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
    console.log(instructions[0]);
  };
  const handleSwitchAccount = async () => {
    console.log("Switching Account");
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Prompt user to switch accounts
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });

      // Reload the page after account switch
      window.location.reload();
    } catch (error) {
      console.error("Error switching accounts:", error);
      // You might want to show an error message to the user here
    }
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

      <AppBar position="static" color="primary" enableColorOnDark>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <BlurCircularIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              APP
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <BlurCircularIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    if (page === "Instructions") {
                      navigate("/instructions");
                    } else if (page == "Home") {
                      navigate("/dash");
                    } else {
                      handleCloseNavMenu();
                    }
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "Logout") {
                        navigate("/");
                      } else {
                        handleCloseUserMenu();
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Wallet">
                <IconButton onClick={handleWalletMenu} sx={{ p: 3, mr: -6 }}>
                  <AccountBalanceWalletIcon sx={{}} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorWallet}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorWallet)}
                onClose={handleWalletMenuClose}
              >
                <Typography textAlign="center">
                  <MenuItem onClick={handleClickA}>
                    <Chip
                      label={
                        account ? `${account.slice(0, 15)}...` : "No Account"
                      }
                      icon={
                        <FiberManualRecordIcon
                          sx={{
                            fontSize: "small",
                            color: account ? "green" : "red",
                          }}
                        />
                      }
                      sx={{
                        backgroundColor: "transparent",
                        border: "1px solid black",
                        color: "black",
                        "& .MuiChip-icon": {
                          color: account ? "green" : "red",
                        },
                      }}
                    />
                  </MenuItem>

                  {ViewAcc === true && (
                    <Snackbar
                      autoHideDuration={3000}
                      open={ViewAcc}
                      onClose={handleClose}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="info"
                        sx={{ width: "10  0%" }}
                      >
                        Wallet Address: {account}
                      </Alert>
                    </Snackbar>
                  )}
                  <MenuItem onClick={handleClickB}>
                    Balance: {parseFloat(balance).toFixed(3)} ETH
                  </MenuItem>
                  {ViewBal === true && (
                    <Snackbar
                      open={ViewBal}
                      autoHideDuration={3000}
                      onClose={handleClose}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="info"
                        sx={{ width: "100%" }}
                      >
                        Wallet Balance: {balance} ETH
                      </Alert>
                    </Snackbar>
                  )}
                </Typography>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
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
            instructions={instructions}
            readInstructions={readInstr}
            handleonSend={handleClose}
          />
        )}
      </Box>
    </>
  );
};

export default Instr;
