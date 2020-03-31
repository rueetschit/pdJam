# Pd docker image
Ubuntu based docker image containing a pure data installation and the project patch.
The container runs pure data exposing port **5001** for `netreceive`.

## Configuration

Edit the patches in pure-data or pd-l2ork.

**Important**: 
Set the icecast host and password in the patch before starting! The password is configured in the icecast server as `ICECAST_SOURCE_PASSWORD`.

## Build and run

    # Build image:
    $ docker build -t pd .

    # Run container:
    $ docker run -d -p 5001:5001 pd

