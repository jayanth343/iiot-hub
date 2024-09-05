import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, List, ListItem, ListItemText,ListItemIcon, Button, Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function Dashboard() {
  const [wallets, setWallets] = useState([]);
  const Fields = [
    'P1 : Boiler Process',
    "P2 : Turbine Process",
    'P3 : Water Treatment Process',
  ];
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');

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
        '0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C',
        "0x5aD439688E4a5f2E13Af800938452EA945858598",
        '0x42801F08769AB356265e08957ed9dfe0b08C626c',
      ];
      setWallets(mockWallets);
    };

    fetchWallets();
  }, []);




  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>
              Dashboard
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Systems
            </Typography>
            <List>
              {Fields.map((field, index) => (
                <ListItem key={index} sx={{ padding: 0 }}>
                  <Button 
                    fullWidth 
                    onClick={() => handleClickOpen(field, wallets[index])}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    <ListItemText primary={field} />
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedField}</DialogTitle>
        <DialogContent>
          <Typography>
            Wallet Address: {selectedWallet}
          </Typography>
          {/* Add more details here as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;

/*
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, List, ListItem, ListItemText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material';

function Dashboard() {
  const [wallets, setWallets] = useState([]);
  const Fields= [
    'P1 : Boiler Process',
    "P2 : Turbine Process",
    'P2 : Water Treatment Process',
  ];
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Simulating fetching wallets from the network
    // Replace this with actual API call or Web3 interaction
    const fetchWallets = async () => {
      const mockWallets = [
        '0xaC3fb9B59E57626aE1e9A4CA8ca10ff169dC2D8C',
        "0x5aD439688E4a5f2E13Af800938452EA945858598",
        '0x42801F08769AB356265e08957ed9dfe0b08C626c',
    ];
    
    
      setWallets(mockWallets);
    };

    fetchWallets();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>
              Dashboard
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Systems
            </Typography>
            <List>
              {wallets.map((wallet, index) => (
                <ListItem key={index}>
                  <ListItemText >{Fields[index]} </ListItemText>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;

*/