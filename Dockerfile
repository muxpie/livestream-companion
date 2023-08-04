# Use the official Golang image to create a build artifact.
FROM golang:1.20-alpine as builder

# Enable Go Modules
ENV GO111MODULE=on

# Install git.
# Git is required for fetching the dependencies.
RUN apk update && apk add --no-cache git gcc musl-dev npm

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files 
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and the go.sum files are not changed 
RUN go mod download 

# Copy the source from the current directory to the working Directory inside the container 
COPY . .

# Build the Go app
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Download all dependencies. Dependencies will be cached if the go.mod and the go.sum files are not changed 
WORKDIR /app/mui/livestream-companion-ui
RUN npm install
RUN npm run build 
RUN mv build /app/ui

######## Start a new stage from scratch #######
FROM alpine:latest  

RUN apk --no-cache add ca-certificates ffmpeg vlc

WORKDIR /root/

# Create the /data and .data directory
RUN mkdir /data

# Create a symlink from ./data to /data
RUN ln -s /data ./

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .

# Copy the UI folder from your source to the current location in the image
COPY --from=builder /app/ui ./ui

# Copy the player folder from your source to the current location in the image
COPY --from=builder /app/player ./player

# Expose port 5004 to the outside world
EXPOSE 5004

# Run the binary program produced by `go build`
CMD ["./main"] 
