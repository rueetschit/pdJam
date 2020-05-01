FROM node:alpine

WORKDIR /app
EXPOSE 5000

COPY . .

RUN npm install && \
    cd frontend && \
    npm install && \
    npm run build

CMD ["npm", "start"]