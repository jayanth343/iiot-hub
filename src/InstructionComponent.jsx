import React, { useState, useEffect } from "react";
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
  instructions,
  readInstructions,
  loadState,
  handleonSend,
  handleMarkRead,
}) => {
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [src, setSrc] = useState("");
  const [dest, setDest] = useState("");
  const [viewReceivedInstr, setViewReceivedInstr] = useState(false);
  const [receivedInstructions, setReceivedInstructions] = useState([]);
  const [selectedReceivedInstr, setSelectedReceivedInstr] = useState({});
  const [readIndexList, setReadIndexList] = useState([]);
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

  const handleCloseReceivedInstr = (instr) => {
    console.log("Read Index List: ", readIndexList);
    let resultIndex = readIndexList.findIndex(
      (item) =>
        item.to === instr.destination &&
        item.timestamp === instr.timestamp &&
        !item.isRead
    );
    console.log("Result For This Instruction: ", resultIndex);

    setViewReceivedInstr(false);
    if (resultIndex != -1) {
      //console.log("Found Instr  :\n",readIndexList[resultIndex]);
      let src = readIndexList[resultIndex].from;
      let dest = readIndexList[resultIndex].to;
      let indx = readIndexList[resultIndex].index;
      console.log("Src: ", src);
      console.log("Dest: ", dest);
      console.log("Index: ", indx);
      handlemarkInstrRead(src,dest,indx);
    }
    setSelectedReceivedInstr({});
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewReceived = async () => {
    setViewReadInstr(true);
    setShowSkeleton(true);
    let list = [];
    setReceivedInstructions(readInstructions);
    for (let i = 0; i < readInstructions.length; i++) {
      let ac = readInstructions[i].sender;
      await sleep(1000);
      const r = await myContract.methods.getInstr().call({ from: ac });
      if (r && r[readInstructions[i].indsx]) {
        let entry = {
          from: readInstructions[i].sender,
          to: readInstructions[i].destination,
          index: readInstructions[i].indsx,
          isRead: r[readInstructions[i].indsx].isRead,
          timestamp: readInstructions[i].timestamp,
        };
        list.push(entry);
      }
    }
    setReadIndexList(list);
    setTimeout(() => {
      setShowSkeleton(false);
    }, 2000);
  };

  const handlemarkInstrRead = async (src, dest, tp) => {
    handleMarkRead(src, dest, tp);
    //setmarkInstrRead(false);
    //window.location.reload();
  };

  if (showSkeleton) {
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
      {!viewReadInstr && (
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
              Sent Instructions {instructions.length}
            </Typography>
            <Divider />
            {instructions.length == 0 ? (
              <Typography sx={{ p: 2 }}>
                <Alert severity="warning">
                  <AlertTitle>No Instructions Found for User !</AlertTitle>
                </Alert>
              </Typography>
            ) : (
              <List sx={{ 
                maxHeight: instructions.length > 4 ? '420px' : 'auto', 
                overflow: instructions.length > 4 ? 'auto' : 'visible',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}>
                {instructions.map((item, i) => (
                  <React.Fragment key={i}>
                    <Box >
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
                    </Box>
                          <Dialog
                      open={viewInstr}
                      onClose={handleClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "rgba(18, 18, 18, 1)",
                          color: "white",
                        },
                      }}
                    >
                      <DialogTitle sx={{ color: "white" }}>
                        {" "}
                        <Typography variant="h4" sx={{ color: "white" }}>
                          Instruction Details
                        </Typography>
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText
                          component="div"
                          sx={{ color: "white" }}
                        >
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
                        <Button onClick={handleClose} sx={{ color: "white" }}>
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewReceived}
              sx={{
                backgroundColor: "#3f51b5",
                color: "white",
                "&:hover": {
                  backgroundColor: "#303f9f",
                },
              }}
            >
              View Received Instructions
            </Button>
          </Box>
        </Box>
      )}
      {viewReadInstr && (
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
            <Typography variant="h2" sx={{ mb: 2, color: "white" }} gutt>
              Received Instructions
            </Typography>
            <Divider />
            <Box
              sx={{ width: "100%", maxWidth: 560, bgcolor: "background.paper" }}
            >
              {receivedInstructions.length === 0 ? (
                <Alert severity="warning">
                  <AlertTitle>No Instructions Received!</AlertTitle>
                </Alert>
              ) : (
                <List
                sx={{ 
                  maxHeight: readInstructions.length > 4 ? '400px' : 'auto', 
                  overflow: readInstructions.length > 4 ? 'auto' : 'visible',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                >
                  {readInstructions.map((instr, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        onClick={() => handleReceivedInstrClick(instr)}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                          },
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "10px",
                          mb: 1,
                        }}
                      >
                        <ListItemIcon>
                          {readIndexList.some(
                            (item) =>
                              item.to === instr.destination &&
                              item.timestamp === instr.timestamp &&
                              !item.isRead
                          ) && (
                            <FiberManualRecordIcon
                              sx={{ color: "white", fontSize: "small" }}
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <>
                              {`${index + 1}. ${instr.content}`}
                              <Typography
                                variant="body2"
                                sx={{ color: "grey.500" }}
                              >
                                From: <i>{instr.sender}</i>
                              </Typography>
                            </>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{ color: "grey.500" }}
                            >
                              Date:{" "}
                              {new Date(
                                Number(instr.timestamp) * 1000
                              ).toLocaleString()}
                            </Typography>
                          }
                        />
                        <Divider />
                      </ListItem>
                      <Dialog
                        open={selectedReceivedInstr === instr}
                        onClose={handleCloseReceivedInstr}
                        PaperProps={{
                          style: {
                            backgroundColor: "#2e2e2e",
                            color: "white",
                          },
                        }}
                      >
                        <DialogTitle sx={{ color: "white" }}>
                          <Typography variant="h4" sx={{ color: "white" }}>
                            Instruction Details
                          </Typography>{" "}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText
                            component="div"
                            sx={{ color: "white" }}
                          >
                            <Typography variant="body1">
                              Content: {instr.content}
                            </Typography>
                            <Typography variant="body1">
                              From: <i>{instr.sender}</i>
                            </Typography>
                            <Typography variant="body1">
                              Time Received:{" \t"}
                              {new Date(
                                Number(instr.timestamp) * 1000
                              ).toLocaleString()}
                              <Typography variant="body1"></Typography>
                            </Typography>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => handleCloseReceivedInstr(instr)}
                            sx={{ color: "white" }}
                          >
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowSkeleton(true);
                  setViewReadInstr(false);
                  setTimeout(() => {
                    setShowSkeleton(false);
                  }, 2000);
                }}
                sx={{
                  backgroundColor: "#3f51b5",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                }}
              >
                Back to Sent Instructions
              </Button>
            </Box>
          </Box>
          <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadState}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        </Box>
      )}
    </>
  );
};

export default InstructionsComponent;
