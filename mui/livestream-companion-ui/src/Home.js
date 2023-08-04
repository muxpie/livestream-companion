import React from 'react';
import { Container, Paper, Typography, Box, Alert } from '@mui/material';

function Home() {
  return (
    <Container>
      <Paper style={{ padding: '20px' }}>
        <Typography color={"#66B2FF"} variant="h3" align="center" gutterBottom>
          Welcome to MuxPie LiveStream Companion!
        </Typography>
        <Typography paragraph>
          MuxPie LiveStream Companion is a robust and versatile streaming tool designed to bring you an outstanding and smooth viewing experience, right from Plex, Emby.
        </Typography>
        <Typography paragraph>
          We have designed it with a clear focus on simplicity and convention over configuration. This means you get to spend less time fiddling with settings and more time enjoying your favourite content.
        </Typography>
        <Typography paragraph>
          LiveStream Companion supports streaming both Xtream Code and m3u.
        </Typography>
        <Typography paragraph>
          Though its core function is to serve as a reliable multiplexer for Plex and Emby, MuxPie LiveStream Companion also offers a helpful web player feature. This extra perk allows you to test your streams and, if desired, watch programs directly from your browser. However, it's important to note that while this feature enhances the user experience, the primary aim of our tool remains providing a seamless streaming experience to Plex and Emby users.
        </Typography>
        <Typography paragraph>
          Get started and experience an effortless streaming solution like no other. Welcome to MuxPie LiveStream Companion!
        </Typography>
        <Typography variant="h4" align="center" gutterBottom>
          How to Use MuxPie LiveStream Companion
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Step 1: Get Set Up
        </Typography>
        <Typography paragraph>
          The first step in your journey is setting up your playlist. Navigate to the 'Playlist' menu and add your desired playlist. MuxPie LiveStream Companion will take care of the rest by downloading the relevant categories, channels, and programmes from your provider.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Step 2: Choose Your Categories
        </Typography>
        <Typography paragraph>
          Next, head over to the 'Categories' menu. Here, you'll have the power to activate the categories that interest you. Tailor your MuxPie experience to suit your viewing preferences.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Step 3: Select Your Channels
        </Typography>
        <Typography paragraph>
          Your next stop is the 'Channel' menu. From the list of available channels (derived from your active categories), make your selections. These are the channels that you'll be able to stream on Plex or Emby.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Step 4: Integrate with Plex or Emby
        </Typography>
        <Typography paragraph>
          Now that you've curated your categories and channels, it's time to integrate with Plex or Emby. Head to your preferred tool and add MuxPie LiveStream Companion as a Live TV Provider. Simply copy the server and XMLTV URLs located at the top of this application.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Step 5: Kick Back and Enjoy
        </Typography>
        <Typography paragraph>
          Congratulations! You've completed the setup. Now, all that's left to do is sit back, relax, and enjoy a seamless streaming experience, brought to you by MuxPie LiveStream Companion.
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="warning">
            Disclaimer: As a user of MuxPie LiveStream Companion, it is your responsibility to ensure the legality of your streams. Please verify that your providers rightfully own the content you're streaming. MuxPie LiveStream Companion is not responsible for the source of your streams and assumes that all users uphold the highest standard of integrity with regard to copyright and content ownership laws.
          </Alert>
        </Box>
      </Paper>
    </Container>
  );
}

export default Home;
