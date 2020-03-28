FROM ubuntu:18.04

# Pd netreceive port
EXPOSE 5001

WORKDIR /app

# Install Pd
# TODO: install and use Pd-l2ork instead
#  check http://l2ork.music.vt.edu/main/make-your-own-l2ork/software/
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get install -y puredata

# Mount the patches into the container
ADD patches patches

# Run patch in headless mode
CMD ["pd", "-nogui", "-open", "patches/netreceive-print.pd"]