import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';
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
import mpegts from 'mpegts.js';

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
  const videoRef = useRef(null);
  const dialogRef = useRef(null);
  const [player, setPlayer] = useState(null);
  
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

  const createPlayer = useCallback(() => {
    if (currentChannel && videoRef.current) {
      const playerInstance = mpegts.createPlayer({
        type: 'mpegts',
        isLive: true,
        url: `/hls/${currentChannel.ID}.ts?webbrowser=true`,
      });
  
      playerInstance.attachMediaElement(videoRef.current);
      playerInstance.load();
      playerInstance.play();
      
      setPlayer(playerInstance); // Save the player instance to the state
    }
  }, [currentChannel]);
  
  const cleanupPlayer = () => {
    if (player) {
      player.detachMediaElement(); // Detach the media element
      player.destroy(); // Destroy the player
      setPlayer(null);
      videoRef.current.src = ""; // Reset the video source
    }
  };
  
  useEffect(() => {
    if (openDialog) {
      // Manually call createPlayer after a slight delay to ensure the dialog is fully open
      setTimeout(createPlayer, 100);
    }
  }, [openDialog, createPlayer]);

  const filteredChannels = channels.filter(channel =>
    channel.name && channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playStream = (channel) => {
    setCurrentChannel(channel);
    setOpenDialog(true);
  };
  
  const closeDialog = () => {
    cleanupPlayer();
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
                          <Box display='flex' justifyContent='space-between' width='95%'>
                            <Box>
                              <IconButton onClick={() => onToggleActive(channel)}>
                                {channel.Active ? <CheckIcon /> : <CloseIcon />}
                              </IconButton>
                            </Box>
                            <Box>
                              <IconButton onClick={() => playStream(channel)}>
                                <LiveTvIcon /> 
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

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

              </Table>
            </TableContainer>
          )}
          <Dialog
            ref={dialogRef}
            open={openDialog}
            onClose={closeDialog}
            maxWidth={isMobile ? '100%' : false} // For mobile, set to '100%', for desktop keep it as false
            fullScreen={isMobile ? false : false}
            PaperProps={isMobile ? { style: { width: '100%', maxWidth: 'none' } } : {}} // Override Material-UI's internal maxWidth only for mobile
          >
            <DialogTitle>{currentChannel?.name}</DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '100%' : 688, // You can set a maximum width here
                position: 'relative',
                paddingBottom: isMobile ? '56.25%' : 'auto', // 16:9 aspect ratio
                height: isMobile ? '56.25%' : (9 / 16) * 688 // 16:9 aspect ratio,
              }}
            >
              <video
                ref={videoRef}
                id="videoElement"
                controls
                autoPlay
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              ></video>
            </DialogContent>

            <DialogActions>
              <Button onClick={closeDialog}>Close</Button>
            </DialogActions>
          </Dialog>

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
