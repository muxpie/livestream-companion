import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, Box, TextField, Select, MenuItem, Checkbox, FormControl, InputLabel, Button, FormControlLabel, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import BuildIcon from '@mui/icons-material/Build';
import { SnackbarContext } from './SnackbarContext';

const PlaylistDetail = ({ onSnackbarOpen }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const playlistId = id !== undefined ? id : "new";
  const { openSnackbar } = useContext(SnackbarContext);
  const [data, setData] = useState({
    ID: "",
    Description: "",
    Server: "",
    Username: "",
    Password: "",
    Type: "xcode",
    XmltvURL: "",
    M3uURL: "",
    Restream: true,
  });

  const typeOptions = [
    { key: "xcode", text: "Xtream Code" },
    { key: "m3u", text: "M3U" },
  ];

  useEffect(() => {
    if (playlistId !== "new") {
      axios.get(`/api/playlist/${playlistId}`).then(response => {
        setData(response.data);
      });
    }
  }, [playlistId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    setData(prevData => ({ ...prevData, Restream: event.target.checked }));
  };

  const onSave = () => {
    if (playlistId === "new") {
      createPlaylist();
    } else {
      updatePlaylist();
    }
  };

  const onCancel = () => {
    navigate("/playlists");
  };

  const createPlaylist = async () => {
    try {
      const { ID, ...dataWithoutID } = data;
      await axios.post("/api/playlist", dataWithoutID);
      openSnackbar("Data created successfully!");
      onCancel();
    } catch (error) {
      openSnackbar("Failed to create data.");
    }
  };

  const updatePlaylist = async () => {
    try {
      await axios.put(`/api/playlist/${data.ID}`, data);
      openSnackbar("Data updated successfully!");
      onCancel();
    } catch (error) {
      openSnackbar("Failed to update data.");
    }
  };

  const buildXmltvUrl = () => {
    if (data.Type === 'xcode' && data.Server && data.Username && data.Password) {
      const sXmltvUrl = `${data.Server}/xmltv.php?username=${data.Username}&password=${data.Password}`;
      setData(prevData => ({ ...prevData, XmltvURL: sXmltvUrl }));
    }
  };

  return (
    <Box sx={{ '& .MuiTextField-root': { m: 1 }, }}>
      <Typography variant="h5" sx={{ marginBottom: 10, fontWeight: 'bold' }}>Edit Playlist</Typography>
      <form noValidate autoComplete="off">
        <Grid container spacing={2}>
          {playlistId !== 'new' && (
            <Grid item xs={12} sm={12}>
              <TextField label="ID" value={data.ID} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
          )}
  
          <Grid item xs={12} sm={12}>
            <TextField label="Description" name="Description" value={data.Description} onChange={handleInputChange} fullWidth />
          </Grid>
  
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select label="Type" name="Type" value={data.Type} onChange={handleInputChange}>
                {typeOptions.map(option => (
                  <MenuItem key={option.key} value={option.key}>{option.text}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
  
          {data.Type === 'm3u' && (
            <Grid item xs={12} sm={12}>
              <TextField label="M3U URL" name="M3uURL" value={data.M3uURL} onChange={handleInputChange} fullWidth />
            </Grid>
          )}
  
          {data.Type === 'xcode' && (
          <>
            <Grid item xs={12} sm={12}>
              <TextField label="Server" name="Server" value={data.Server} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField label="Username" name="Username" value={data.Username} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField label="Password" name="Password" value={data.Password} onChange={handleInputChange} fullWidth />
            </Grid>
          </>
          )}

          {(data.Type === 'xcode' || data.Type === 'm3u') && (
            <Grid item xs={12} sm={12}>
              <TextField 
                label="XMLTV URL" 
                name="XmltvURL" 
                value={data.XmltvURL} 
                onChange={handleInputChange} 
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={buildXmltvUrl}>
                        <BuildIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
  
          <Grid item xs={12} sm={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.Restream}
                  onChange={handleCheckboxChange}
                />
              }
              label="Restream"
            />
            <Alert severity="info">
              Restream enhances compatibility by transforming the stream into the format recognized by Plex and Emby, so it's generally advisable to keep it activated.
            </Alert>
            <Box sx={{ marginTop: 2 }}>
          </Box>
          </Grid>
  
          <Grid item xs={12}>
            <Button variant="contained" onClick={onSave}>Save</Button>
            <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
  
}  
export default PlaylistDetail;

