FROM ubuntu:14.04
# pd-extended is not supported on newer versions of ubuntu...

WORKDIR /app

# Install pd-extended (needed for audio streaming)
# installation steps: http://puredata.info/docs/faq/debian
RUN apt-get update && \
    apt-get install -y software-properties-common lsb-core && \
    add-apt-repository "deb http://apt.puredata.info/releases `lsb_release -c | awk '{print $2}'` main" && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-key 9f0fe587374bbe81 && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-key D63D3D09C39F5EEB && \
    apt-get update && \
    apt-get install -y --force-yes pd-extended

# Mount the patches into the container
ADD patches patches

# Pd netreceive port
EXPOSE 5001

# Run patch in headless mode
# TODO: change the used patch!
CMD ["pd-extended", "-nogui", "-open", "patches/pdJam-compose-local.pd"]