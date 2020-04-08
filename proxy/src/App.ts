import express from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import * as path from 'path';
import {SynthSettings} from 'SynthSettings.ts';
import {Config} from 'Config';

const MAX_PD_USERS = 20;
const app = express();

app.set('port', process.env.PORT || 5002);

app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/config', (req, res) => {
  const config: Config = {
    server: process.env.SERVER || 'localhost:5002/pdjam-webclient',
  };
  res.json(config);
});

app.all('*', (req, res) => {
  res.redirect('/');
});

export const server = http.createServer(app);
const io = require('socket.io')(server, {origins: '*:*'});


// Client socket id => Pd id
const userPdMappings: Map<string, number> = new Map();
const availablePdUsers: number[] = [];

for (let currentUser = 0; currentUser < MAX_PD_USERS; currentUser++) {
  availablePdUsers.push(currentUser);
}


// socket.io namespace for pdjam server socket
const pdjamServerSocket = io.of('/pdjam-server');

// socket.io namespace for web clients
const webClientNamespace = io.of('pdjam-webclient');

pdjamServerSocket.on('connection', (socket: Socket) => {
  console.log('pdjam server connected');

  socket.on('disconnect', () => {
    console.log('pdjam server socket disconnected');
    webClientNamespace.emit('pdjam_error', {message: 'error, the server was disconnected'});
    return;
  });
});

const broadcastNumberOfConnectedClients = () => {
  webClientNamespace.emit('connected_clients', MAX_PD_USERS - availablePdUsers.length);
  console.log('No. of connected clients: ', MAX_PD_USERS - availablePdUsers.length);
  console.log(userPdMappings);
};

webClientNamespace.on('connection', (socket: Socket) => {
  console.log('Client connected. Socket id: ', socket.id);

  if (!pdjamServerSocket || !pdjamServerSocket.connected) {
    console.log('Client tried to connect but pdjam server is not connected');
    socket.emit('pdjam_error', {message: 'the server is currently disconnected'});
    return;
  }

  if (availablePdUsers.length <= 1) {
    console.log('No more clients available');
    socket.emit('occupied', {message: 'there are currently no more drones available, please try again later'});
    return;
  }

  const pdUserId = availablePdUsers.pop();
  userPdMappings.set(socket.id, pdUserId);

  broadcastNumberOfConnectedClients();

  socket.on('disconnect', () => {
    const pdUser = userPdMappings.get(socket.id);
    if (!pdUser) {
      console.log('Could not find pd user for client id: ', socket.id);
      return;
    }
    pdjamServerSocket.emit('client_disconnect',{pdUser: pdUser});
    availablePdUsers.push(pdUserId);
    userPdMappings.delete(socket.id);
    broadcastNumberOfConnectedClients();
    console.log('Client disconnected. Socket id: ', socket.id);
  });

  socket.on('init', (settings: SynthSettings) => {
    const pdUser = userPdMappings.get(socket.id);
    if (!pdUser) {
      console.log('Could not find pd user for client id: ', socket.id);
      return;
    }
    pdjamServerSocket.emit('client_init', {pdUser: pdUser, settings: settings});
    console.log('Initialized pdUser ', pdUser);
  });

  socket.on('value_change', (settings: SynthSettings) => {
    const pdUser = userPdMappings.get(socket.id);
    if (!pdUser) {
      console.log('Could not find pd user for client id: ', socket.id);
      return;
    }
    pdjamServerSocket.emit('update_settings', {pdUser: pdUser, settings: settings});
    console.log('Updated synth settings for pd user: ', pdUser);
  });
});

export default app;
