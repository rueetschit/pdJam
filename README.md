# PdJam
*Distributed online synthesizer*

## Prerequisites

The used pure data patch expects the specified icecast server to be running. 
The server expects a running pure data installation with the exposed netreceive port at 5001.  
Run pure data either locally or use the provided docker image at `./pd`

## Run server

    $ cd server
    
    # Install project dependencies (only initially):
    $ npm install
    
    # Start server:
    $ npm start
    
    # Defined environment variables when running:
    $ PD_HOST=... PD_PORT=... npm start

## Run everything with docker-compose

    # Set the icecast passwords to be used as env vars:
    $ export ICECAST_ADMIN_PASSWORD=...
    $ export ICECAST_SOURCE_PASSWORD=...
    $ export ICECAST_RELAY_PASSWORD=...
    
    # Build server and puredata images:
    $ docker-compose build
    
    # Run both containers:
    $ docker-compose up -d

    # Shut down:
    $ docker-compose down

- pdJam server: http://localhost:5000
- Puredata: tcp://localhost:5001
- Icecast audio streaming server: http://localhost:8000

## Deployment to cloud

Build and push docker images to Docker Hub
   
    # Build and tag images:
    $ docker build -t <docker hub username>/pdjam:latest server/
    $ docker build -t <docker hub username>/pd:latest pd/
    $ docker build -t <docker hub username>/pdic:latest icecast/
    
    # Log into docker hub:
    $ docker login --username <docker hub username>
   
    # Push to docker hub
    $ docker push <docker hub username>/pdjam:latest
    $ docker push <docker hub username>/pd:latest
    $ docker push <docker hub username>/pdic:latest

Cloud deployment:
1. Deploy icecast first and set password environment variables
2. Deploy puredata (set host and password in patch first)
3. Deploy pdjam server

## Docs

- FUDI - PureData communication protocol: https://en.wikipedia.org/wiki/FUDI