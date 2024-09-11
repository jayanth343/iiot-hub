import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "./App.css";
import Home from "./Home";
import Dashboard from "./dashboard";
import D2 from "./d2";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

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

function Dash() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [ViewAcc, setViewAcc] = useState(false);
  const [ViewBal, setViewBal] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);

          const accounts = await web3.eth.getAccounts();
          setWalletAddress(accounts[0]);
          const balanceWei = await web3.eth.getBalance(accounts[0]);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(balanceEth);
          window.ethereum.on("accountsChanged", (accounts) => {
            setWalletAddress(accounts[0]);
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
    setWallets(accounts);
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", connectWallet);
      }
    };
  }, []);

  const pages = ["Home", "Instructions", "Logs"];
  const settings = ["Profile", "Switch Account", "Logout"];
  const [anchorWallet, setAnchorWallet] = useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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

  const handleClickA = () => {
    setViewAcc(true);
  };

  const handleClickB = () => {
    setViewBal(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setViewAcc(false);
    setViewBal(false);
    handleWalletMenuClose();
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
              href="#Dashboard"
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
              IIoT Hub
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
                  <MenuItem key={page} onClick={
                    ()=> {
                      if (page === 'Instructions') {
                        navigate('/instructions');
                      } else {
                        handleCloseNavMenu();
                      }
                    }
                  }
                    >
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
              href="#app-bar-with-responsive-menu"
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
                onClick={
                  ()=> {
                    if (page === 'Instructions') {
                      navigate('/instructions');
                    } else if (page === 'Logs') {
                      navigate('/graphql');
                    } else {
                      handleCloseNavMenu();
                    }
                  }
                }
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
                    if (setting === 'Logout') {
                      window.location.href = '/';
                    }else if (setting === 'Switch Account') {
                      handleSwitchAccount();
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
                    {" "}
                    <Chip
                      label={
                        walletAddress
                          ? `${walletAddress.slice(0, 15)}...`
                          : "No Account"
                      }
                      icon={
                        <FiberManualRecordIcon
                          sx={{
                            fontSize: "small",
                            color: walletAddress ? "green" : "red",
                          }}
                        />
                      }
                      sx={{
                        backgroundColor: "transparent",
                        border: "1px solid white",
                        color: "white",
                        "& .MuiChip-icon": {
                          color: walletAddress ? "green" : "red",
                        },
                      }}
                    />
                  </MenuItem>
                  {ViewAcc === true &&  ViewBal ===false && (
                    <Snackbar
                      autoHideDuration={3000}
                      open={ViewAcc}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="info"
                        sx={{
                          width: "100%",
                          backgroundColor: 'lightblue',
                          color: '#0d47a1',
                          borderRadius: '16px',
                          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                          '& .MuiAlert-icon': {
                            color: '#1976d2'
                          }
                        }}
                      >
                        Wallet Address: {walletAddress}
                      </Alert>
                    </Snackbar>
                  )}

                  <MenuItem onClick={handleClickB}>
                    Balance: {parseFloat(balance).toFixed(3)} ETH
                  </MenuItem>
                  {ViewBal === true && ViewAcc === false && (
                    <Snackbar
                      open={ViewBal}
                      autoHideDuration={3000}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="info"
                        sx={{
                          width: "100%",
                          backgroundColor: '#f0f0f0',
                          color: '#333',
                          borderRadius: '16px',
                          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                          '& .MuiAlert-icon': {
                            color: '#2196f3'
                          }
                        }}
                      >
                        Wallet Balance: {balance}
                      </Alert>
                    </Snackbar>
                  )}
                </Typography>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
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
