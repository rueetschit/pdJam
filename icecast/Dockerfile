FROM debian:stable-slim

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /app
COPY start.sh .

RUN apt -y update && \
    apt -y install icecast2 python-setuptools cron-apt && \
    chown -R icecast2 /etc/icecast2 && \
    chown -R icecast2 /var/log/icecast2 && \
    chown -R icecast2 /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 8000
USER icecast2

CMD ["./start.sh"]