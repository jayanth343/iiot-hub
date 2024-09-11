import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Skeleton,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Alert,
  AlertTitle,
  Menu,
  MenuItem,
} from "@mui/material";

const InstructionsComponent = ({ instructions, handleonSend }) => {
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [viewReceivedInstr, setViewReceivedInstr] = useState(false);
  const [receivedInstructions, setReceivedInstructions] = useState([]);
  const [selectedReceivedInstr, setSelectedReceivedInstr] = useState({});
    
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewReadInstr, setViewReadInstr] = useState(false);
  const [viewInstr, setViewInstr] = useState(false);
  const [selectedInstr, setSelectedInstr] = useState({});
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInstrClick = (event) => {
    setViewInstr(true);
    setSelectedInstr(event);
  };

  const handleReceivedInstrClick = (event) => {
    setViewReceivedInstr(true);
    setSelectedReceivedInstr(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setViewInstr(false);
  };

  const handleCloseReceivedInstr = () => {
    setViewReceivedInstr(false);
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
          {Array.from({ length: instructions.length }).map((_, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ backgroundColor: "#2C2D2A" }}>
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "4px",
                    backgroundColor: "#2C2D2A",
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={24}
                    sx={{ backgroundColor: "#3C3D3A", mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={20}
                    sx={{ backgroundColor: "#3C3D3A", mb: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={560}
                    height={60}
                    sx={{ backgroundColor: "#2C2D2A" }}
                  />
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </>
    );
  }
  return (
    <>
      {showSkeleton == false && viewReadInstr == false && (
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
            "& .MuiListItemText-secondary": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiDivider-root": {
              backgroundColor: "rgba(255, 255, 255, 0.12)",
            },
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
          <Box
            sx={{ width: "100%", maxWidth: 560, bgcolor: "background.paper" }}
          >
            <Typography variant="h2" gutterBottom>
              Sent Instructions
            </Typography>
            <Divider />
            {instructions.length == 0 ? (
              <Typography sx={{ p: 2 }}>
                <Alert severity="warning">
                  <AlertTitle>No Instructions Found for User !</AlertTitle>
                </Alert>
              </Typography>
            ) : (
              <List>
                {instructions.map((item, i) => (
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
                      onClick={() => handleInstrClick(item)}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        primary={
                          <>
                            {`${i + 1}. ${item.content}`}
                            <br />
                            To: {item.destination}
                          </>
                        }
                        secondary={`Date: ${new Date(
                          Number(item.timestamp) * 1000
                        ).toLocaleString()}`}
                      />
                    </ListItem>
                    <Dialog 
                      open={viewInstr} 
                      onClose={handleClose}
                      PaperProps={{
                        style: {
                          backgroundColor: 'rgba(18, 18, 18, 1)',
                          color: 'white'
                        },
                      }}
                    >
                      <DialogTitle sx={{ color: 'white' }} > <Typography variant="h4">Instruction Details</Typography></DialogTitle>
                      <DialogContent>
                        <DialogContentText sx={{ color: 'white' }}>
                          
                          <Typography variant="body1">
                            Content: {selectedInstr.content}
                          </Typography>
                          <Typography variant="body1">
                            Destination: {selectedInstr.destination}
                          </Typography>
                          <Typography variant="body1">
                            Time Sent:{" "}
                            {new Date(
                              Number(selectedInstr.timestamp) * 1000
                            ).toLocaleString()}
                          </Typography>
                          <Typography variant="body1">
                            Status: {selectedInstr.isRead ? "Read" : "Unread"}
                          </Typography>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} sx={{ color: 'white' }}>Close</Button>
                      </DialogActions>
                    </Dialog>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setViewReadInstr(true)}
          sx={{
            backgroundColor: '#3f51b5',
            color: 'white',
            '&:hover': {
              backgroundColor: '#303f9f',
            },
          }}
        >
          View Received Instructions
        </Button>
      </Box>
      
        </Box>
        
      )}
      {viewReadInstr && (
        <Box sx={{ mt: 4, backgroundColor: '#2C2D2A', color: 'white', padding: 2, borderRadius: 2 }}>
          <Typography variant="h2" sx={{ mb: 2, color: 'white' }}>Received Instructions</Typography>
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {receivedInstructions.length === 0 ? (
              <Alert severity="warning">
                <AlertTitle>No Instructions Received!</AlertTitle>
              </Alert>
            ) : (
              <List>
                {receivedInstructions.map((instr, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      button
                      onClick={() => handleReceivedInstrClick(instr)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={instr.content}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'grey.500' }}>
                            From: {instr.sender} | {new Date(Number(instr.timestamp) * 1000).toLocaleString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Dialog
                      open={selectedReceivedInstr === instr}
                      onClose={handleCloseReceivedInstr}
                      PaperProps={{
                        style: {
                          backgroundColor: '#2e2e2e',
                          color: 'white',
                        },
                      }}
                    >
                      <DialogTitle>Instruction Details</DialogTitle>
                      <DialogContent>
                        <DialogContentText sx={{ color: 'white' }}>
                          <Typography variant="body1">
                            Content: {instr.content}
                          </Typography>
                          <Typography variant="body1">
                            From: {instr.sender}
                          </Typography>
                          <Typography variant="body1">
                            Time Received:{" "}
                            {new Date(Number(instr.timestamp) * 1000).toLocaleString()}
                          </Typography>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseReceivedInstr} sx={{ color: 'white' }}>Close</Button>
                      </DialogActions>
                    </Dialog>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setViewReadInstr(false)}
              sx={{
                backgroundColor: '#3f51b5',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              Back to Sent Instructions
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default InstructionsComponent;
