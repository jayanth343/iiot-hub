import { useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import BlurCircularIcon from "@mui/icons-material/BlurCircular";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useNavigate } from "react-router-dom";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
const Navbar = ({ account, balance }) => {
  const pages = ["Home", "Access List", "Instructions", "Logs"];
  const settings = ["Profile", "Switch Account", "Logout"];
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [anchorWallet, setAnchorWallet] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [ViewAcc, setViewAcc] = useState(false);
  const [ViewBal, setViewBal] = useState(false);
  const navigate = useNavigate();
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
    setErrorMsg("");
  };

  const handleErrorOpen = () => {
    setOpen(true);
  };
  const handleErrClose = () => {
    setOpen(false);
  };

  
  const handleSwitchAccount = async () => {
    console.log("Switching Account");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      window.location.reload();
    } catch (error) {
      console.error("Error switching accounts:", error);
    }
  };


  return (
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

                  } else if (page === "Access List") {
                    navigate("/send-instruction");
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
            <Tooltip title="Open Settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                <Avatar sx={{ width: 36, height: 36, backgroundColor: 'primary.main' }}><ManageAccountsIcon sx={{ fontSize: 30, color: 'white' }} /></Avatar>
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
                <AccountBalanceWalletIcon sx={{color: 'white'}} />
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
  );
};

export default Navbar;
