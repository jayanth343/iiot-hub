import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "./App.css";
import Home from "./Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  Alert,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import AccessListComponent from "./AccessListComponent";
function Sendinstr() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [instruction, setInstruction] = useState("");
  const [tempaddr, setTempaddr] = useState("");
  const [account, setaccount] = useState("");
  const [balance, setBalance] = useState("");
  const [web3Instance, setWeb3Instance] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [myContract, setMyContract] = useState(null);
  const [sendingInstr, setSendingInstr] = useState(false);
  const [sendingInstrAcc, setSendingInstrAcc] = useState("");

  //UseEffect
  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);
          setWeb3Instance(web3);
          const accounts = await web3.eth.getAccounts();
          setaccount(accounts[0]);
          const balanceWei = await web3.eth.getBalance(accounts[0]);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(balanceEth);
          window.ethereum.on("accountsChanged", (accounts) => {
            setaccount(accounts[0]);
          });
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    const initializeApp = async () => {
      await connectWallet();
      setContractAddress("0x417213E993FA352d287A1AeeFCD3B0E5F053DB97"); //0x48Cd6D14407c2a485Beb94dB437b689a2C3927bc
      const accounts = [
        "0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C",
        "0x5aD439688E4a5f2E13Af800938452EA945858598",
        "0x42801F08769AB356265e08957ed9dfe0b08C626c",
        "0xFa09771045DD25cb6c50227EfDED68777BC5d58D",
      ];
      setWallets(accounts);

      // Wait for contract initialization
      await initContract();

      // Now fetch instructions
      const fetchAL = async () => {
        if (myContract && account) {
          try {
            console.log("Exec alCount....");
            const al = await myContract.methods.alCount(account).call();
            console.log("Calling alCount...", al);

            if (Array.isArray(al[0])) {
              console.log("Setting access list:", al[0]);
              setAccessList(al[0]);
            } else {
              console.log("Invalid response format:", al);
            }
          } catch (error) {
            console.error("Error fetching instructions:", error);
            if (error.message) console.error("Error message:", error.message);
          }
        }
      };

      fetchAL();
    };

    initializeApp().catch(console.error);

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", connectWallet);
      }
    };
  }, []);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const initContract = useCallback(async () => {
    if (web3Instance && contractAddress && !myContract) {
      try {
        console.log("Initializing contract with address:", contractAddress);
        const contract = new web3Instance.eth.Contract(abi, contractAddress);
        setMyContract(contract);
        return Promise.resolve();
      } catch (error) {
        console.error("Error initializing contract:", error);
        if (error.message) console.error("Error message:", error.message);
        return Promise.reject(error);
      }
    }
  }, [web3Instance, contractAddress, myContract]);
  useEffect(() => {
    initContract();
  }, [initContract]);

  useEffect(() => {
    const fetchAL = async () => {
      if (web3Instance && contractAddress && myContract) {
        try {
          console.log("Exec alCount....");
          const al = await myContract.methods.alCount(account).call();
          console.log("Calling alCount...");
          console.log("Receipt:", al);
          setAccessList(al[0]);
          console.log(accessList);
        } catch (error) {
          console.error("Error fetching instructions:", error);
          if (error.message) console.error("Error message:", error.message);
        }
      }
    };

    fetchAL();
  }, [myContract]);

  const pages = ["Home", "Instructions", "Logs"];
  const settings = ["Profile", "Switch Account", "Logout"];
  const [SentInstrStatus, setSentInstrStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [SelectedSameAcc, setSelectedSameAcc] = useState(false);
  const [accessAdded, setAccessAdded] = useState(false);
  const [accessAddedErr, setAccessAddedErr] = useState(false);
  const [accessAddedErrMsg, setAccessAddedErrMsg] = useState("");
  const [anchorWallet, setAnchorWallet] = useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = useState(false);
  const [ViewAcc, setViewAcc] = useState(false);
  const [ViewBal, setViewBal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    
  };

  const handleClickA = () => {
    setViewAcc(true);
  };

  const handleClickB = () => {
    setViewBal(true);
  };

  const handleSendInstrEvent = (a) => {
    if (a) {
      setSendingInstr(true);
      setSendingInstrAcc(a);
    }
  };

  useEffect(() => {
    if (sendingInstrAcc) {
      console.log("open dialog for:", sendingInstrAcc);
    }
  }, [sendingInstrAcc]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setViewAcc(false);
    setViewBal(false);
    setIsLoading(false);
    setSelectedSameAcc(false);
    handleWalletMenuClose();
    setAccessAdded(false);
    setAccessAddedErr(false);
    setAccessAddedErrMsg("");
  };

  const handleErrorOpen = () => {
    setOpen(true);
  };
  const handleErrClose = () => {
    setOpen(false);
  };

  const handleAddAccess = (address, access) => {
    console.log("Adding Access");
    setIsLoading(true);
    if (address == "") {
      console.log("We here");
      setTempaddr(address);
      setOpen(true);
    } else if (address == account) {
      setSelectedSameAcc(true);
    } else if (accessList.length == 4) {
      setAccessAddedErr(true);
      setAccessAddedErrMsg("Access List Full");
    } else {
      let rs = false;
      let ac = access.toLowerCase() === "true";
      myContract.methods
        .AddtoList(account, address, ac)
        .send({
          from: account,
        })
        .then(() => {
          setAccessAdded(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error adding to list:", error);
          setAccessAddedErr(true);
          setAccessAddedErrMsg(error.message);
          setIsLoading(false);
        });
    }
  };

  const handleSendInstr = async () => {
    setIsLoading(true);
    handleInstrClose();

    //setIsLoading(false);

    
    if (instruction != "" && sendingInstrAcc != "") {
      console.log("Sending Instruction:", instruction);
      console.log("Sending to:", sendingInstrAcc);
      const timestampEpoch = Date.now();
      console.log(timestampEpoch);
      myContract.methods
        .sendInstr(sendingInstrAcc, instruction)
        .send({
          from: account,
        }).then((r)=>{
      console.log(r);
      setIsLoading(false);
      setSentInstrStatus(true);
      setInstruction("");
    }).catch((error)=>{
      console.error("Error sending instruction:", error);
      setAccessAddedErr(true);
      setAccessAddedErrMsg(error.message);
      setInstruction("");
      setIsLoading(false);
    });
    } else if (instruction == ""){
      setAccessAddedErr(true);
      setAccessAddedErrMsg("Instruction is empty");
      setIsLoading(false);
      setInstruction("");
    } else if (sendingInstrAcc == ""){
      setAccessAddedErr(true);
      setAccessAddedErrMsg("No Recipient Selected");
      setIsLoading(false);
      setInstruction("");
    }
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
                  <MenuItem
                    key={page}
                    onClick={() => {
                      if (page === "Instructions") {
                        window.location.href = "/instructions";
                      } else if (page === "Home") {
                        window.location.href = "/dash";
                      } else {
                        handleCloseNavMenu();
                      }
                    }}
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
                    } else if (page === "Home") {
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
                      } else if (setting === "Switch Account") {
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

                  {ViewAcc === true && ViewBal === false && (
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
                  {ViewBal === true && ViewAcc === false && (
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
        <AccessListComponent
          accessList={accessList}
          onAddAccess={handleAddAccess}
          onSend={handleSendInstrEvent}
          loadState={isLoading}
          disableEscapeKeyDown
          disableBackdropClick
        />
        <Dialog
          open={accessAdded}
          onClose={() => setAccessAdded(false)}
          PaperProps={{
            style: {
              backgroundColor: "#2C2D2A",
              color: "white",
            },
          }}
          disableEscapeKeyDown
          disableBackdropClick
        >
          <DialogTitle sx={{ color: "white" }}>Access Added</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "lightgrey" }}>
              Access for Node Added Successfully!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setAccessAdded(false);
                window.location.reload();
              }}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {accessAddedErr && (
          <Snackbar
            open={accessAddedErr}
            autoHideDuration={5000}
            onClose={handleClose}
            disableEscapeKeyDown
            disableBackdropClick
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert severity="error" style={{ borderRadius: "16px" }}>
              Error: {accessAddedErrMsg}
            </Alert>
          </Snackbar>
        )}
        {accessAdded &&
          setTimeout(() => {
            window.location.reload();
          }, 3000)}
      </Box>
      {SelectedSameAcc && (
        <Snackbar
          open={setSelectedSameAcc}
          autoHideDuration={2000}
          onClose={handleClose}
          disableEscapeKeyDown
          disableBackdropClick
        >
          <Alert severity="error">Cannot Select Host Address!</Alert>
        </Snackbar>
      )}
      <Dialog open={open} onClose={handleErrClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>Address: {tempaddr} already in List!</DialogContent>
        <DialogActions>
          <Button onClick={handleErrClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={sendingInstr}
        onClose={handleInstrClose}
        PaperProps={{
          style: {
            backgroundColor: "#2C2D2A",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ color: "white" }}>
          Sending Instruction to{" "}
          <span style={{ color: "lightblue", fontStyle: "italic" }}>
            {sendingInstrAcc}
          </span>
        </DialogTitle>
        <DialogTitle sx={{ fontSize: 14, mt: -1.5, color: "white" }}>
          Time: {new Date().toLocaleTimeString()}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="instruction"
            label="Enter your instruction"
            type="text"
            fullWidth
            variant="outlined"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              style: { color: "white", borderColor: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "white",
              },
            }}
            onClick={handleSendInstr}
          >
            Send
          </Button>
          <Snackbar
            open={SentInstrStatus && !sendingInstr && !isLoading}
            autoHideDuration={2000}
            onClose={() => {
              setSentInstrStatus(false);
              setInstruction("");

            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => {
                setSentInstrStatus(false);
                setInstruction("");
                handleInstrClose();
              }}
              severity="success"
              sx={{ width: "100%", color: "white", backgroundColor: "gray" }}
            >
              Instruction sent successfully!
            </Alert>
          </Snackbar>
          <Button
            onClick={handleInstrClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Sendinstr;
