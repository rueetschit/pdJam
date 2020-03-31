# Icecast 2 Streaming Server

## Configuration
Currently using default config from icecast installation.
To change it change the `./config/icecast.xml` and mount it into `/etc/icecast2/`

## Build and run

    # Build docker image:
    $ docker build -t icecast .
    
    # Run on port 8000:
    $ docker run -d -p 8000:8000 -e ICECAST_SOURCE_PASSWORD=... -e ICECAST_ADMIN_PASSWORD=... -e ICECAST_RELAY_PASSWORD=... icecast

## Docs
https://icecast.org/docs/icecast-trunk/config_file/