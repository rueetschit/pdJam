FROM ubuntu:18.04

# Pd netreceive port
EXPOSE 5001

WORKDIR /app

# Install Pd
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get install -y puredata

# Mount the patches into the container
ADD patches patches

# Run patch in headless mode
CMD ["pd", "-nogui", "-open", "patches/netreceive-01.pd"]