import express from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import * as path from 'path';
import * as net from 'net';
import PdClient from './PdClient';
import {OscFrequencyMessage} from 'OscFrequencyMessage';


const app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, '../../client')));

export const server = http.createServer(app);
const io = require('socket.io')(server);

const pdClient = new PdClient(new net.Socket(), '127.0.0.1', 5001);
pdClient.connect();

const MAX_CLIENTS = 40;
const availableClients: number[] = [];

for (let currentClient = 0; currentClient < MAX_CLIENTS; currentClient++) {
  availableClients.push(currentClient);
}


io.on('connection', (socket: Socket) => {
  console.log('Client connected. Socket id: ', socket.id);

  if (availableClients.length <= 0) {
    console.log('No more clients available');
    return;
  }

  let clientId = availableClients.pop();
  console.log('Number of available clients: ', availableClients.length);

  socket.emit('client_id', clientId);
  io.emit('connected_clients', MAX_CLIENTS - availableClients.length);

  socket.on('disconnect', () => {
    availableClients.push(clientId);
    io.emit('connected_clients', MAX_CLIENTS - availableClients.length);
    console.log('Client disconnected. Socket id: ', socket.id);
    console.log('Number of available clients: ', availableClients.length);
  });

  socket.on('osc_frequency', (message: OscFrequencyMessage) => {
    console.log('Received new osc frequency: ', message.frequency);
    pdClient.send(`${message.clientId} frequency ${message.frequency} ;`);
  });
});

export default app;
