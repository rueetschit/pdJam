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
    server: process.env.SERVER || 'localhost:5002',
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

const broadcastNumberOfConnectedClients = () => {
  io.emit('connected_clients', MAX_PD_USERS - availablePdUsers.length);
  console.log('No. of connected clients: ', MAX_PD_USERS - availablePdUsers.length);
  console.log(userPdMappings);
};

let pdjamServerSocket: Socket | undefined = undefined;

io.on('connection', (socket: Socket) => {
  console.log('Client connected. Socket id: ', socket.id);

  if (socket.handshake.query.id === 'pdjam_server') {
    console.log('pdjam server connected');
    pdjamServerSocket = socket;
    return;
  }

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

  // TODO: check why not triggering when pdjam server is stopped
  pdjamServerSocket.on('disconnect', () => {
    console.log('pdjam server socket disconnected');
    io.emit('pdjam_error', {message: 'error, the server was disconnected'});
    return;
  });

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
