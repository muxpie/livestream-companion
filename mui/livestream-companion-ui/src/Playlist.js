import React, { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PendingIcon from '@mui/icons-material/Pending';
import InProgressIcon from '@mui/icons-material/Update';
import AcceptIcon from '@mui/icons-material/Check';
import DeclineIcon from '@mui/icons-material/Clear';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import axios from 'axios';

const DeleteButton = ({ playlistId, onDeletion }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/playlist/${playlistId}`);
      alert('Playlist successfully deleted');
      onDeletion();  // trigger the parent to reload the data
    } catch (err) {
      alert('Failed to delete the playlist');
    }
    setOpen(false);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Playlist"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this playlist?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const getIconByStatus = (status) => {
  switch (status) {
    case 0: return <PendingIcon />;
    case 1: return <InProgressIcon />;
    case 2: return <AcceptIcon />;
    case -1: return <DeclineIcon />;
    default: return <QuestionMarkIcon />;
  }
};

const getTooltipByStatus = (status) => {
  switch (status) {
    case 0: return "Import not started - click to start";
    case 1: return "Import in progress";
    case 2: return "Import completed - click to retrigger";
    case -1: return "Import failed - click to retry";
    default: return "Unknown status";
  }
};

const ImportStatusButton = ({ importStatus, handlePress }) => {
  return (
    <Tooltip title={getTooltipByStatus(importStatus)}>
      <IconButton color="primary" onClick={handlePress}>
        {getIconByStatus(importStatus)}
      </IconButton>
    </Tooltip>
  );
};

const PlaylistTable = () => {
  const [rows, setRows] = useState([]);

  const fetchPlaylists = async () => {
    const response = await fetch('/api/playlists');
    return response.json();
  };

  // Function to update the playlist data and check the import status
  const refreshPlaylists = useCallback(async () => {
    let playlists = await fetchPlaylists();
    setRows(playlists);

    // Check if any playlist is in importing state (0 or 1)
    let isImporting = playlists.some(playlist => [0, 1].includes(playlist.ImportStatus));
    
    if (isImporting) {
      // Wait for 2 seconds and then re-run the refreshPlaylists function
      setTimeout(refreshPlaylists, 2000);
    }
  }, []);

  useEffect(() => {
    refreshPlaylists();
  }, [refreshPlaylists]);

  const handleEdit = (row) => {
    // Handle edit action...
  };

  const handleDelete = (row) => {
    // Handle delete action...
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Import Status</TableCell>
              <TableCell>EPG Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ID}>
                <TableCell>{row.ID}</TableCell>
                <TableCell>{row.Description}</TableCell>
                <TableCell>{row.Type}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <DeleteButton playlistId={row.ID} onDeletion={refreshPlaylists} />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleDelete(row)}>
                    <SearchIcon />
                  </IconButton>
                  <ImportStatusButton importStatus={row.ImportStatus} />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleDelete(row)}>
                    <SearchIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" >Add New</Button>
    </Box>
  );
};

export default PlaylistTable;
