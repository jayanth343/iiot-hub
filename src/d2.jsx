import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Box,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

function D2() {
  const [wallets, setWallets] = useState([]);
  const Fields = [
    "P1 : Boiler Process",
    "P2 : Turbine Process",
    "P3 : Water Treatment Process",
  ];
  const services = [
    { name: Fields[0], isOperational: true },
    { name: Fields[1], isOperational: false },
    { name: Fields[2], isOperational: true },
  ];
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  const handleClickOpen = (field, wallet) => {
    setSelectedField(field);
    setSelectedWallet(wallet);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Simulating fetching wallets from the network
    const fetchWallets = async () => {
      const mockWallets = [
        "0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C",
        "0x5aD439688E4a5f2E13Af800938452EA945858598",
        "0x42801F08769AB356265e08957ed9dfe0b08C626c",
      ];
      setWallets(mockWallets);
    };

    fetchWallets();
  }, []);

  const OperationalListItem = ({ index, text, isOperational }) => {
    return (
      <ListItem
        key={index}
        sx={{
          padding: 0,
          backgroundColor: "#2C2D2A",
          border: "1px solid #444",
          borderRadius: "4px",
          marginBottom: "8px",
        }}
      >
        <Button
          fullWidth
          onClick={() => handleClickOpen(text, wallets[index])}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            color: "white",
          }}
        >
          <ListItemText
            primary={text}
            primaryTypographyProps={{ color: "white" }}
            secondary={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                mt={1}
              >
                <FiberManualRecordIcon
                  sx={{
                    color: isOperational ? "green" : "red",
                    fontSize: "12px",
                    marginRight: 1,
                  }}
                />
                <Chip
                  label={isOperational ? "Operational" : "Down"}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: isOperational ? "green" : "red",
                    borderColor: isOperational ? "green" : "red",
                    backgroundColor: "#2C2D2A",
                  }}
                />
              </Box>
            }
            secondaryTypographyProps={{ color: "white" }}
          />
        </Button>
      </ListItem>
    );
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, backgroundColor: "#2C2D2A", color: "white" }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: "#2C2D2A", color: "white" }}>
            <Typography variant="h2" gutterBottom sx={{ color: "white" }}>
              Dashboard
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: "#2C2D2A", color: "white" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Active Systems
            </Typography>
            <List>
              {services.map((service, index) => (
                <OperationalListItem
                  key={index}
                  text={service.name}
                  index={index}
                  isOperational={service.isOperational}
                />
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { backgroundColor: "#2C2D2A", color: "white" } }}
      >
        <DialogTitle sx={{ color: "white" }}>{selectedField}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "white" }}>
            Wallet Address: {selectedWallet}
          </Typography>
          {/* Add more details here as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "white" }}>
            Send Instruction
          </Button>
          <Button onClick={handleClose} sx={{ color: "white" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = "/send-instruction")}
          sx={{
            backgroundColor: "#4CAF50",
            color: "white",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}
        >
          View AccessList{" "}
        </Button>
      </Box>
    </Container>
  );
}

export default D2;
