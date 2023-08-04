import React, { useContext, useState, useCallback } from 'react';
import { SnackbarProvider, SnackbarContext } from './SnackbarContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import CategoryIcon from '@mui/icons-material/Category';
import TvIcon from '@mui/icons-material/Tv';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import Home from './Home';
import Playlist from './Playlist';
import PlaylistDetail from './PlaylistDetail';
import Category from './Category';
import Channel from './Channel';

const drawerWidth = 240;

const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for browsers that do not support navigator.clipboard
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textarea);
  }
};

export default function App() {
  return (
    <SnackbarProvider>
      <AppContent />
    </SnackbarProvider>
  );
}

function AppContent() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { openSnackbar } = useContext(SnackbarContext);

  const onCopyServerAddress = useCallback(() => {
    const serverAddress = window.location.origin;
    copyToClipboard(serverAddress);
    openSnackbar('Server address copied to clipboard!');
  }, [openSnackbar]);

  const onCopyXmltvLink = useCallback(() => {
    const xmltvLink = window.location.origin + "/xmltv";
    copyToClipboard(xmltvLink);
    openSnackbar('XMLTV link copied to clipboard!');
  }, [openSnackbar]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 15px', 
        px: 1, 
        ...theme.mixins.toolbar,
        justifyContent: 'space-between',
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#fff' }}>
          MuxPie
        </Typography>

      </Box>
      <List>
        <ListItem button component={RouterLink} to="/">
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={RouterLink} to="/playlists">
          <ListItemIcon>
            <ListIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Playlists" />
        </ListItem>
        <ListItem button component={RouterLink} to="/categories">
          <ListItemIcon>
            <CategoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem button component={RouterLink} to="/channels">
          <ListItemIcon>
            <TvIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Channels" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Router basename='/mui'>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{backgroundImage: 'none'}}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ marginRight: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 15px', 
              px: 1, 
              ...theme.mixins.toolbar,
              justifyContent: 'space-between',
            }}>
              <Typography variant="h6" noWrap component="div" sx={{ color: '#fff' }}>
                MuxPie
              </Typography>

            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ marginRight: 1 }}>Server Address:</Typography>
                <Tooltip title="Copy Server Address">
                  <IconButton color="inherit" onClick={onCopyServerAddress}>
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ marginRight: 1 }}>XMLTV Address:</Typography>
                <Tooltip title="Copy XMLTV Link Address">
                  <IconButton color="inherit" onClick={onCopyXmltvLink}>
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={drawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
            },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paperAnchorDockedLeft`]: {
              borderRight: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Box
          margin={"20px"}
          component="main"
          sx={{ flexGrow: 1, ml: drawerOpen ? drawerWidth : 0 }}
        >
          <Toolbar /> {/* This is necessary to offset content below AppBar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlist />} />
            <Route path="/playlists/new" element={<PlaylistDetail />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/channels" element={<Channel />} />
          </Routes>
        </Box>

        <SnackbarContext.Consumer>
          {({ snackbarOpen, snackbarMessage, closeSnackbar }) => (
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
              <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          )}
        </SnackbarContext.Consumer>
      </Box>
    </Router>
  );
}
