import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Grid, Container, Box, Typography, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Toolbar, Button, TextField, Select, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import AppBar from '@mui/material/AppBar';
import { SnackbarContext } from './SnackbarContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

const Channels = () => {
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [channels, setChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { openSnackbar } = useContext(SnackbarContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get('/api/playlists').then(response => {
      setPlaylists(response.data);
      setSelectedPlaylistId(response.data[0]?.ID);
    });
  }, []);
  
  const fetchCategories = useCallback(() => {
    axios.get(`/api/playlists/${selectedPlaylistId}/categories/active`).then(response => {
      const allCategoriesOption = { ID: "all", category_name: "All categories" };
      const categoriesWithAllOption = [allCategoriesOption, ...response.data];
      setCategories(categoriesWithAllOption);
      setSelectedCategoryId(allCategoriesOption?.ID);
    });
  }, [selectedPlaylistId]);
  

  useEffect(() => {
    if (selectedPlaylistId) {
      fetchCategories();
    }
  }, [selectedPlaylistId, fetchCategories]);

  const fetchChannels = useCallback(() => {
    if (selectedCategoryId === "all") { // If "All categories" is selected
      axios.get(`/api/playlists/${selectedPlaylistId}/channels`).then(response => {
        setChannels(response.data);
      });
    } else {
      axios.get(`/api/categories/${selectedCategoryId}/channels`).then(response => {
        setChannels(response.data);
      });
    }
  }, [selectedPlaylistId, selectedCategoryId]);

  useEffect(() => {
    if (selectedPlaylistId && selectedCategoryId) {
      fetchChannels();
    }
  }, [selectedPlaylistId, selectedCategoryId, fetchChannels]);

  const onToggleActive = (channel) => {
    const updatedChannel = { ...channel, Active: !channel.Active };
    axios.put("/api/channel/" + updatedChannel.ID, updatedChannel);
    const updatedChannels = channels.map(ch => {
      if (ch.ID === updatedChannel.ID) {
        return updatedChannel;
      }
      return ch;
    });
    setChannels(updatedChannels);
  };

  const onActivateAll = (playlistID, categoryID) => {
    if (categoryID === "all") {
      axios.put("/api/playlists/" + playlistID + "/channels/activateAll", { Active: true }).then(response => {
        fetchChannels();
        openSnackbar('All channels activated successfully!');
      }); 
    } else {
      axios.put("/api/category/" + categoryID + "/channels/activateAll", { Active: true }).then(response => {
        fetchChannels();
        openSnackbar('All channels activated successfully!');
      });
    }
  };

  const onDeactivateAll = (playlistID, categoryID) => {
    if (categoryID === "all") {
      axios.put("/api/playlists/" + playlistID + "/channels/activateAll", { Active: false }).then(response => {
        fetchChannels();
        openSnackbar('All channels deactivated successfully!');
      }); 
    } else {
      axios.put("/api/category/" + categoryID + "/channels/activateAll", { Active: false }).then(response => {
        fetchChannels();
        openSnackbar('All channels deactivated successfully!');
      });
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name && channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playStream = (channel) => {
    setCurrentChannel(channel);
    setOpenDialog(true);
  };
  
  const closeDialog = () => {
    setOpenDialog(false);
  };
  
  return (
    <Container>
      <Box>
        <Box style={{ paddingBottom: '60px' }}>
          <Typography variant="h5" sx={{ marginBottom: 10, fontWeight: 'bold' }}>Channels</Typography>
          
          <Toolbar disableGutters>
  <Grid container direction="row" spacing={2}>
    <Grid item xs={12} sm={4}>
      <Select 
        value={selectedPlaylistId} 
        onChange={e => setSelectedPlaylistId(e.target.value)} 
        sx={{ width: '100%' }}
      >
        {playlists.map(playlist => (
          <MenuItem key={playlist.ID} value={playlist.ID}>{playlist.Description}</MenuItem>
        ))}
      </Select>
    </Grid>

    <Grid item xs={12} sm={4}>
      <Select 
        value={selectedCategoryId} 
        onChange={e => setSelectedCategoryId(e.target.value)} 
        sx={{ width: '100%' }}
      >
        {categories.map(category => (
          <MenuItem key={category.ID} value={category.ID}>{category.category_name}</MenuItem>
        ))}
      </Select>
    </Grid>

    <Grid item xs={12} sm={4}>
      <TextField 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </Grid>
  </Grid>
</Toolbar>

          
          {isMobile ? (
            <Box sx={{marginTop: 15}}>
              <Grid container spacing={2} >
                {filteredChannels.map((channel) => (
                  <Grid item xs={12} key={channel.ID} >
                    <Paper
                      sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: 1,
                      }}
                    >
                      <Grid container spacing={1} sx={{ margin: [0, 0, 0, 0] }}>
                        <Grid item xs={12}>{channel.ID}: {channel.name}</Grid>
                        <Grid item xs={12}>Status:                          
                          <IconButton onClick={() => onToggleActive(channel)}>
                            {channel.Active ? <CheckIcon /> : <CloseIcon />}
                          </IconButton>
                        </Grid>
                        <Grid item xs={12}> 
                          <IconButton onClick={() => playStream(channel)}>
                            <LiveTvIcon /> 
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Dialog 
                  open={openDialog} 
                  onClose={closeDialog} 
                  maxWidth='xs' //or 'sm', 'md', etc., or 'false' to disable maxWidth
                  fullScreen // makes the Dialog fullScreen on xs and below screens
              >
                  <DialogTitle>{currentChannel?.name}</DialogTitle>
                  <DialogContent sx={{ width: '100%', height: 'calc(100vh - 96px)' }}> {/* Subtracting space for DialogTitle and Button */}
                      <iframe 
                          src={`/player/stream.html?channel=${currentChannel?.ID}`} 
                          width="100%" 
                          height="100%" 
                          title="Player"
                          style={{ border: 0 }} //remove if unnecessary
                      />
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={closeDialog}>Close</Button>
                  </DialogActions>
              </Dialog>

            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Channel Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Play Stream</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredChannels.map(channel => (
                    <TableRow key={channel.ID}>
                      <TableCell>{channel.ID}</TableCell>
                      <TableCell>{channel.name}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => onToggleActive(channel)}>
                          {channel.Active ? <CheckIcon /> : <CloseIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => playStream(channel)}>
                          <LiveTvIcon /> 
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <Dialog open={openDialog} onClose={closeDialog} maxWidth={false}>
                  <DialogTitle>{currentChannel?.name}</DialogTitle>
                  <DialogContent sx={{ width: 688, height: 510 }}>
                    <iframe src={`/player/stream.html?channel=${currentChannel?.ID}`} width="640" height="480" title="Player"></iframe>
                  </DialogContent>
                  <Button onClick={closeDialog}>Close</Button>
                </Dialog>
              </Table>
            </TableContainer>
          )}
        </Box>
        <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
          <Box display="flex" justifyContent="flex-end" padding={2}>
            <Button onClick={() => onDeactivateAll(selectedPlaylistId, selectedCategoryId)}>Deactivate All</Button>
            <Button onClick={() => onActivateAll(selectedPlaylistId, selectedCategoryId)}>Activate All</Button>
          </Box>
        </AppBar>
      </Box>
    </Container>
  );
};

export default Channels;
