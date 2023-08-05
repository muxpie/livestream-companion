import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Container, Box, Typography, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Toolbar, Button, TextField, Select, MenuItem, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

const Categories = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get('/api/playlists').then(response => {
      setPlaylists(response.data);
      setSelectedPlaylistId(response.data[0]?.ID);
    });
  }, []);

  const fetchCategories = useCallback(() => {
    axios.get(`/api/playlists/${selectedPlaylistId}/categories`).then(response => {
      setCategories(response.data);
    });
  }, [selectedPlaylistId]);

  useEffect(() => {
    if (selectedPlaylistId) {
      fetchCategories()
    }
  }, [selectedPlaylistId, fetchCategories]);

  const onPlaylistSelectChange = (event) => {
    setSelectedPlaylistId(event.target.value);
  };

  const onToggleActive = (category) => {
    const updatedCategory = { ...category, Active: !category.Active };
    axios.put("/api/category/" + updatedCategory.ID, updatedCategory);

    const updatedCategories = categories.map(cat => {
      if (cat.ID === updatedCategory.ID) {
        return updatedCategory;
      }
      return cat;
    });
  
    setCategories(updatedCategories);
  };

  const onActivateAll = (playlistID) => {
    axios.put("/api/category/active/" + playlistID, { Active: true }).then(response => {
      fetchCategories()
    });
  };

  const onDeactivateAll = (playlistID) => {
    axios.put("/api/category/active/" + playlistID, { Active: false }).then(response => {
      fetchCategories()
    });
  };

  const filteredCategories = categories.filter(category => 
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container>
      <Box>
        <Box style={{ paddingBottom: '60px' }}>
          <Typography variant="h5" sx={{ marginBottom: 10, fontWeight: 'bold' }}>Categories</Typography>
          <Toolbar disableGutters>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Select 
                  id="playlistSelect" 
                  value={selectedPlaylistId} 
                  onChange={onPlaylistSelectChange} 
                  sx={{ width: '100%' }}
                >
                  {playlists.map(playlist => (
                    <MenuItem key={playlist.ID} value={playlist.ID}>{playlist.Description}</MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
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
                {filteredCategories.map((category) => (
                  <Grid item xs={12} key={category.ID} >
                    <Paper
                      sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: 1,
                      }}
                    >
                      <Grid container spacing={1} sx={{ margin: [0, 0, 0, 0] }}>
                        <Grid item xs={12}>{category.category_id}: {category.category_name}</Grid>
                        <Grid item xs={12}>Status:
                          <IconButton onClick={() => onToggleActive(category)}>
                              {category.Active ? <CheckIcon /> : <CloseIcon />}
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table id="categoriesTable">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Category Name</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map(category => (
                    <TableRow key={category.category_id}>
                      <TableCell>{category.category_id}</TableCell>
                      <TableCell>{category.category_name}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => onToggleActive(category)}>
                          {category.Active ? <CheckIcon /> : <CloseIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
          <Box display="flex" justifyContent="flex-end" padding={2}>
            <Button onClick={() => onDeactivateAll(selectedPlaylistId)}>Deactivate All</Button>
            <Button onClick={() => onActivateAll(selectedPlaylistId)}>Activate All</Button>
          </Box>
        </AppBar>
      </Box>
    </Container>
  );
};

export default Categories;
