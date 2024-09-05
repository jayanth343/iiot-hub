import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, List, ListItem, ListItemText,ListItemIcon, Button, Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

function ins() {
    const [contract,setContract] = useState('');
    useEffect(
        () =>{
            setContract('0x6FeBA6d8867d48a43D4bfE20915ea161FBB0F65a');
            


        },[]
    )
    

}export default ins;