# Pd docker image
Ubuntu based docker image containing a pure data installation and the project patch.
The container runs pure data exposing port **5001** for `netreceive`.

## Build and run

    # Build image:
    $ docker build -t pd .

    # Run container:
    $ docker run -d -p 5001:5001 pd

