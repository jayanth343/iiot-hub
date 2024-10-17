import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Backdrop,
  Typography,
  Skeleton,
  Box,
  TextField,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  DialogActions,
  Button,
  Snackbar,
  Grid,
  Alert,
  AlertTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
const InstructionsComponent = ({
  myContract,
  account,
  instructions,
  readInstructions,
  loadState,
  nodeStatuses,
  nodeVerification,
  blacklisteds,
}) => {
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [incomingInstructions, setIncomingInstructions] = useState([]);
  const [viewReceivedInstr, setViewReceivedInstr] = useState(false);
  const [selectedReceivedInstr, setSelectedReceivedInstr] = useState({});
  const [combinedInstrData, setCombinedInstrData] = useState([]);
  const [anomalyResult, setAnomalyResult] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (readInstructions.length > 0) {
      const incoming = instructions.filter(
        (item) => item.destination == account
      );
      setIncomingInstructions(incoming);
    }
  }, [readInstructions]);

  const handleReceivedInstrClick = (item) => {
    console.log("Item: ", item);
    setSelectedReceivedInstr(item);
    setViewReceivedInstr(true);
  };

  const combineInstrData = (instrSents, instrReads) => {
    const combinedData = [];
  
    instrSents.forEach(sent => {
      const matchingRead = instrReads.find(
        read =>
          read.destination === sent.destination &&
          read.sender === sent.sender &&
          read.indx === sent.indsx
      );
  
      if (matchingRead) {
        combinedData.push({
          sent:sent,
          read:matchingRead
        });
      }
    });
  
    // Sort combinedData by ascending order of timestamp
    combinedData.sort((a, b) => b.sent.timestamp - a.sent.timestamp);
  
    return combinedData;
  };
  
  const handleSendToSVM = async (content) => {
    try {
      const response = await axios.post('http://localhost:3001/run-python', { content });
      console.log('Python script output:', response.data.output);
      // You can update your component state or show a notification with the result
      // For example:
      // setAnomalyResult(response.data.output);
    } catch (error) {
      console.error('Error running Python script:', error);
    }
  };

  useEffect(() => {
    if(combinedInstrData.length == 0){
      const combinedData = combineInstrData(instructions,readInstructions);
      setCombinedInstrData(combinedData);
      console.log('combinedInstrData',combinedData);
    }
  }, [instructions,readInstructions]);

  const handleClose = () => {
    setViewReceivedInstr(false);
    setSelectedReceivedInstr({});
  };

  const handleCloseReceivedInstr = () => {
    setViewReceivedInstr(false);
    setSelectedReceivedInstr({});
  };
  

  if (showSkeleton || combinedInstrData.length == 0) {
    return (
      <>
        <Box
          sx={{
            width: "100%",
            maxWidth: 560,
            bgcolor: "#2C2D2A",
            borderRadius: "4px",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 4,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          ></Typography>
          <Box sx={{ width: "100%", mb: 4 }}>
            <Skeleton
              variant="rectangular"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.08)", height: 200 }}
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Skeleton
                  variant="circular"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                      height: 20,
                      mb: 1,
                    }}
                  />
                  <Skeleton
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                      height: 20,
                      width: "60%",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        
      </>
    );
  }

  return (
    <>
      
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 560, bgcolor: "background.paper" }}>
          <Typography variant="h2" gutterBottom sx={{ p: 2, textAlign: "center" }}>
            Incoming Instructions 
          </Typography>
          <Divider />
          {readInstructions.length == 0 ? (
            <Typography sx={{ p: 2 }}>
              <Alert severity="warning">
                <AlertTitle>No Instructions Found for User !</AlertTitle>
              </Alert>
            </Typography>
          ) : (
            <List
              sx={{
                maxHeight: readInstructions.length > 4 ? "410px" : "auto",
                
                overflow: readInstructions.length > 4 ? "auto" : "visible",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {combinedInstrData.map((item, i) => (
                <React.Fragment key={i}>
                  <Box>
                    <ListItem
                      sx={{
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "4px",
                        mb: 1,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                      }}
                      onClick={() => handleReceivedInstrClick(item)}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        primary={
                          <>
                           {`${i+1}. `} From: {`${item.sent.sender}`}
                            <br />
                            To: {item.sent.destination}
                          </>
                        }
                        secondary={`Date: ${new Date(
                          Number(item.sent.timestamp) * 1000
                        ).toLocaleString()}`}
                      />
                      {blacklisteds.some(b => b.sender === item.read.sender) ? (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            color: "white",
                            backgroundColor: "red",
                            "&:hover": {
                              backgroundColor: "darkgray",
                            },
                          }}
                        >
                          Blacklisted
                        </Button>
                      ) : (
                        !(nodeStatuses.some(n => n.source === item.read.sender && n.status === "verified" && n.timestamp === item.sent.timestamp)) ? (
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              color: "white",
                              borderColor: "white",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                              },
                            }}
                            onClick={() => {
                              console.log(item.sent.content);
                              handleSendToSVM(item.sent.content);
                            }}
                          >
                            Send to SVM
                          </Button>
                        ):(
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              color: "white",
                              borderColor: "white",
                            }}
                            onClick={() => {
                              console.log(item.read.sender)
                              console.log(item.sent.destination)
                              nodeVerification(item.sent.sender,item.sent.destination);
                            }}
                          >
                            Verify
                          </Button>
                        )
                      )}
                    </ListItem>
                  </Box>

                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
        <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadState}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </Box>
    </>
  );
};

export default InstructionsComponent;
