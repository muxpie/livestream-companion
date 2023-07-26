# MuxPie LiveStream Companion

## Overview

MuxPie LiveStream Companion is a robust and versatile streaming tool designed to enhance your viewing experience. It is primarily intended as a multiplexer for Plex and Emby, and can also be used as a web player for quick and straightforward streaming.

The tool is designed with simplicity and convention over configuration in mind. This means you spend less time configuring settings and more time enjoying your favorite content. MuxPie LiveStream Companion currently supports XCode for streaming and will soon add support for m3u8.

## Installation

### Docker

You can run MuxPie LiveStream Companion using Docker with the following command:

```bash
docker run -p 8080:8080 -v /path/to/config:/app/config your_dockerhub_username/muxpie
```

Please replace `/path/to/config` with the path to the folder containing your configuration files.

### Golang

Alternatively, you can run the application directly from the source code:

1. First, clone the repository to your local machine:

```bash
git clone https://github.com/muxpie/livestream-companion.git
```

2. Change into the project directory:

```bash
cd livestream-companion
```

3. Build and run the application:

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
