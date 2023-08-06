# MuxPie LiveStream Companion &middot; ![Dockerize App](https://github.com/muxpie/livestream-companion/actions/workflows/docker-image.yml/badge.svg)

## Overview

MuxPie LiveStream Companion is a robust and versatile streaming tool designed to enhance your viewing experience. It is primarily intended as a multiplexer for Plex and Emby, and can also be used as a web player for quick and straightforward streaming.

The tool is designed with simplicity and convention over configuration in mind. This means you spend less time configuring settings and more time enjoying your favorite content. MuxPie LiveStream Companion supports both Xtream Code and M3u.

## Installation

### Docker

You can run MuxPie LiveStream Companion using Docker with the following command:

```bash
docker run -p 5004:5004 -v /path/to/data:/data muxpie/livestream-companion
```

Please replace `/path/to/config` with the path to the folder containing your configuration files.

### Golang

To run the application directly from the source code, follow these steps:

1. **Clone the Repository**:
Clone the repository to your local machine by executing the following command:
```bash
git clone https://github.com/muxpie/livestream-companion.git
```

2. **Navigate to Project Directory**:
Change into the project directory with this command:
```bash
cd livestream-companion
```

3. **Build and Deploy the UI**:
Before building the Go application, you need to build and deploy the UI. Follow these steps:
- Enter the UI folder:
```bash
cd mui/livestream-companion-ui/
```
- Run the deploy script:
```bash
./deploy.sh
```
- Return to the root folder of the project:
```bash
cd ../../
```

**Install FFmpeg (if not installed)**:
The application requires FFmpeg to be installed on your machine. If you don't have it installed, please refer to the [official FFmpeg documentation](https://ffmpeg.org/download.html) for installation instructions.

**Build and Run the Application**:
Finally, you can build and run the application using these commands:
```bash
go build 
./livestream-companion
```

The application will be accessible at `http://localhost:5004`.

## Usage

Once installed, using MuxPie LiveStream Companion is a breeze. Please refer to our [User Guide](LINK_TO_USER_GUIDE) for detailed instructions.

## Disclaimer

While MuxPie LiveStream Companion makes it easy to stream content, we strongly advocate for the respect of copyright laws. It is your responsibility to ensure that any content you stream is legally permissible and done only for your own usage and that your content providers have the appropriate rights to the content they are providing.

## License

[GPLv3](./LICENSE)
