import express from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import * as path from 'path';
import * as net from 'net';
import PdClient from './PdClient';
import {SynthSettings} from 'SynthSettings.ts';


const app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, '../../client')));
app.all('*', (req, res) => {
  res.redirect('/');
});

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

  socket.on('value_change', (settings: SynthSettings) => {
    if (!userPdMappings.get(socket.id)) {
      console.log('Could not find client socket with id ', socket.id);
      return;
    }
    for (let setting in settings) {
      // TODO: check if need to map from 0..100 to 0..1 for some settings (volume, etc.)
      // @ts-ignore
      pdClient.send(`${userPdMappings.get(socket.id)} ${setting} ${settings[setting]} ;`);
      // @ts-ignore
      console.log(`User ${userPdMappings.get(socket.id)}, setting ${setting}: ${settings[setting]}`);
    }
  });
});

export default app;
