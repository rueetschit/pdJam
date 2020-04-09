# PdJam
*Distributed online synthesizer*

## Prerequisites

The used pure data patch expects the specified icecast server to be running. 
The server expects a running pure data installation with the exposed netreceive port at 5001.  
Run pure data either locally or use the provided docker image at `./pd`

## Run pdjam server

Make sure the proxy and pure data are up and running before starting the pdjam server.

Run with nodejs:

    $ cd server
    $ npm install
    $ npm start

Run with docker:

    $ cd server 
    $ docker build -t pdjam .
    $ docker run -e PROXY=http://pdjam-proxy.azurewebsites.net/pdjam-server -e PD_HOST=host.docker.internal -e PD_PORT=5001 pdjam

## Run everything with docker-compose

    # Build server, proxy and puredata images:
    $ docker-compose build
    
    # Run both containers:
    $ docker-compose up -d

    # Shut down:
    $ docker-compose down

- pdJam server: http://localhost:5000
- Puredata: tcp://localhost:5001


## Deploy proxy to cloud

Build and push docker images to Docker Hub
   
    $ docker build -t <docker hub username>/pdjam-proxy:latest proxy/
    
    # Log into docker hub:
    $ docker login --username <docker hub username>
   
    # Push to docker hub
    $ docker push <docker hub username>/pdjam-proxy:latest

Configure a containerized linux-based app service on Azure to pull the previously pushed docker image from Docker Hub.
After setting up the app service make sure to set the SERVER environment variable in the app service configuration:

    SERVER = http://<app service DNS name>/pdjam-webclient


## Docs

- FUDI - PureData communication protocol: https://en.wikipedia.org/wiki/FUDI

