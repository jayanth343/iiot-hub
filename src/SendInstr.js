import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "./App.css";
import Home from "./Home";
import Navbar from "./components/navbar";
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

  const [SentInstrStatus, setSentInstrStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [SelectedSameAcc, setSelectedSameAcc] = useState(false);
  const [accessAdded, setAccessAdded] = useState(false);
  const [accessAddedErr, setAccessAddedErr] = useState(false);
  const [accessAddedErrMsg, setAccessAddedErrMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const handleInstrClose = () => {
    setSendingInstr(false);
    
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
    setIsLoading(false);
    setSelectedSameAcc(false);
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
      setIsLoading(false);

      console.log("We here");
      setTempaddr(address);
      setOpen(true);
    } else if (access.toLowerCase() != "true" && access.toLowerCase() != "false") {
      setIsLoading(false);
      setAccessAddedErr(true);
      setAccessAddedErrMsg("Invalid Access Value");
    } else if (address == account) {
      setIsLoading(false);
      setSelectedSameAcc(true);
    } else if (accessList.length == 4) {
      setIsLoading(false);
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

      <Navbar
      account={account}
      balance={balance}
      />
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
