import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Toolbar, Button, TextField, Select, MenuItem, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import axios from 'axios';

const Channels = () => {
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [channels, setChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/playlists').then(response => {
      setPlaylists(response.data);
      setSelectedPlaylistId(response.data[0]?.ID);
    });
  }, []);

  const fetchCategories = useCallback(() => {
    axios.get(`/api/playlists/${selectedPlaylistId}/categories/active`).then(response => {
      setCategories(response.data);
      setSelectedCategoryId(response.data[0]?.ID);
    });
  }, [selectedPlaylistId]);

  useEffect(() => {
    if (selectedPlaylistId) {
      fetchCategories();
    }
  }, [selectedPlaylistId, fetchCategories]);

  const fetchChannels = useCallback(() => {
    axios.get(`/api/categories/${selectedCategoryId}/channels`).then(response => {
      setChannels(response.data);
    });
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

  const filteredChannels = channels.filter(channel =>
    channel.name && channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const playStream = (channel) => {
    // Logic to play the stream for the given channel
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 10, fontWeight: 'bold' }}>Channels</Typography>
      
      <Toolbar disableGutters>
        <Select value={selectedPlaylistId} onChange={e => setSelectedPlaylistId(e.target.value)} sx={{ minWidth: 200 }}>
          {playlists.map(playlist => (
            <MenuItem key={playlist.ID} value={playlist.ID}>{playlist.Description}</MenuItem>
          ))}
        </Select>
        <Select value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} sx={{ minWidth: 200 }}>
          {categories.map(category => (
            <MenuItem key={category.ID} value={category.ID}>{category.category_name}</MenuItem>
          ))}
        </Select>
        <Box flexGrow={1} />
        <TextField placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Toolbar>

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
    </Box>
  );
};

export default Channels;
