#!/bin/sh

set_val() {
    if [ -n "$2" ]; then
        sed -i "s/<$2>[^<]*<\/$2>/<$2>$1<\/$2>/g" /etc/icecast2/icecast.xml
    else
        echo "ERROR: setting for '$1' is missing!" >&2
	exit
    fi
}

# replace fields in config
set_val $ICECAST_SOURCE_PASSWORD source-password
set_val $ICECAST_RELAY_PASSWORD  relay-password
set_val $ICECAST_ADMIN_PASSWORD  admin-password

# start icecast server
icecast2 icecast2 -n -c /etc/icecast2/icecast.xml