
## Prerequisites

The server expects a running pure data installation with the exposed netreceive port at 5001.  
Run pure data either locally or use the provided docker image at `./pd`

## Run server

    $ cd server
    
    # Install project dependencies (only initially):
    $ npm install
    
    # Start server:
    $ npm start
    
    # Optionally define environment variables when running:
    $ PD_HOST=... PD_PORT=... npm start

## Run with docker-compose

    # Build server and puredata images:
    $ docker-compose build
    
    # Run both containers:
    $ docker-compose up -d

    # Shut down:
    $ docker-compose down

## Docs

- FUDI - PureData communication protocol: https://en.wikipedia.org/wiki/FUDI