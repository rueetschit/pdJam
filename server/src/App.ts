import express from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import * as path from 'path';
import * as net from 'net';
import PdClient from './PdClient';


const app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, '../../client')));

export const server = http.createServer(app);
const io = require('socket.io')(server);

const pdClient = new PdClient(new net.Socket(), '127.0.0.1', 5001);
pdClient.connect();

const MAX_CLIENTS = 40;

// Client socket id => Pd id
const userPdMappings: Map<string, number> = new Map();
const availablePdUsers: number[] = [];

for (let currentUser = 0; currentUser < MAX_CLIENTS; currentUser++) {
  availablePdUsers.push(currentUser);
}

const broadcastNumberOfConnectedClients = () => {
  io.emit('connected_clients', MAX_CLIENTS - availablePdUsers.length);
  console.log('No. of connected clients: ', MAX_CLIENTS - availablePdUsers.length);
  console.log(userPdMappings);
};

io.on('connection', (socket: Socket) => {
  console.log('Client connected. Socket id: ', socket.id);

  if (availablePdUsers.length <= 0) {
    console.log('No more clients available');
    return;
  }

  const pdUserId = availablePdUsers.pop();
  userPdMappings.set(socket.id, pdUserId);

  broadcastNumberOfConnectedClients();

  socket.on('disconnect', () => {
    availablePdUsers.push(pdUserId);
    userPdMappings.delete(socket.id);

    broadcastNumberOfConnectedClients();
    console.log('Client disconnected. Socket id: ', socket.id);
  });

  socket.on('osc_frequency', (frequency) => {
    if (!userPdMappings.get(socket.id)) {
      console.log('Could not find client socket with id ', socket.id);
      return;
    }
    pdClient.send(`${userPdMappings.get(socket.id)} frequency ${frequency} ;`);
    console.log('Received new osc frequency: ', frequency);
  });
});

export default app;
