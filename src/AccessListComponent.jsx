import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Skeleton,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  AlertTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AccessListComponent = ({ accessList, onAddAccess, onSend }) => {
  const [newAddress, setNewAddress] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [newAccessValue, setNewAccessValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const open = Boolean(anchorEl);

  const addresses = [
    "0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C",
    "0x5aD439688E4a5f2E13Af800938452EA945858598",
    "0x42801F08769AB356265e08957ed9dfe0b08C626c",
    "0xFa09771045DD25cb6c50227EfDED68777BC5d58D",
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddressSelect = (address) => {
    setNewAddress(address);
    handleClose();
  };
  const handleAddAccess = () => {
    if (newAddress && newAccessValue) {
      onAddAccess(newAddress, newAccessValue);
      setNewAddress("");
      setNewAccessValue("");
    }
  };
  const handleonSend = async (item) => {
    try {
      const address = await item.addr;

      setSendAddress(address);
      onSend(address);
      setNewAddress("");
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const handleSelectAddress = (item) => {
    const selectedAddress = item.addr;
    setSendAddress(selectedAddress);
    console.log("Selected address:", sendAddress);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return (
      <>
        <List>
          <ListItem sx={{ backgroundColor: "#2C2D2A" }}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "4px",
                backgroundColor: "#2C2D2A",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={560}
                height={60}
                sx={{ backgroundColor: "#2C2D2A" }}
                animation="wave"
              />
            </Box>
          </ListItem>
          <ListItem sx={{ backgroundColor: "#2C2D2A" }}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "4px",
                backgroundColor: "#2C2D2A",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={560}
                height={60}
                sx={{ backgroundColor: "#2C2D2A" }}
                animation="wave"
              />
            </Box>
          </ListItem>
          <ListItem sx={{ backgroundColor: "#2C2D2A" }}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "4px",
                backgroundColor: "#2C2D2A",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={560}
                height={60}
                sx={{ backgroundColor: "#2C2D2A" }}
                animation="wave"
              />
            </Box>
          </ListItem>
        </List>
      </>
    );
  }

  return (
    <Box
      sx={{
        "& .MuiBox-root": { backgroundColor: "#2C2D2A" },
        "& .MuiPaper-root": { backgroundColor: "#2C2D2A" },
        "& .MuiList-root": { backgroundColor: "#2C2D2A" },
        "& .MuiListItem-root": { backgroundColor: "#2C2D2A" },
        "& .MuiMenu-paper": { backgroundColor: "#2C2D2A" },
        color: "white",
        "& .MuiTypography-root": { color: "white" },
        "& .MuiButton-root": {
          color: "white",
          borderColor: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
        "& .MuiListItemText-primary": { color: "white" },
        "& .MuiListItemText-secondary": { color: "rgba(255, 255, 255, 0.7)" },
        "& .MuiDivider-root": { backgroundColor: "rgba(255, 255, 255, 0.12)" },
        "& .MuiMenuItem-root": {
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
        "& .MuiAlert-standardWarning": {
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          color: "#ffa726",
        },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 560, bgcolor: "background.paper" }}>
        <Typography variant="h2" gutterBottom>
          Access List
        </Typography>
        <Divider />
        {accessList.length == 0 ? (
          <Typography sx={{ p: 2 }}>
            <Alert severity="warning">
              <AlertTitle>No access rights defined!</AlertTitle>
            </Alert>
          </Typography>
        ) : (
          <List>
            {accessList.map((item, i) => (
              <React.Fragment key={i}>
                <ListItem
                  sx={{
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "4px",
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                  alignItems="flex-start"
                  secondaryAction={
                    <Button
                      variant="outlined"
                      onClick={() => handleonSend(item)}
                    >
                      Send
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`Address: ${item.addr}`}
                    secondary={`Can Access?: ${item.access}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Select Address
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {addresses.map((address, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            <Grid item>
              <Typography variant="body1" sx={{ ml: 2, color: "white" }}>
                {newAddress ? `Selected: ${newAddress}` : "No address selected"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bool val"
                value={newAccessValue}
                onChange={(e) => setNewAccessValue(e.target.value)}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
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
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAddAccess}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AccessListComponent;
