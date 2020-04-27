import express from 'express';
import cors from 'cors';
import * as http from 'http';
import {Socket} from 'socket.io';
import * as path from 'path';
import * as net from 'net';
import PdClient from './PdClient';
import {SynthSettings} from 'SynthSettings.ts';
import {Config} from 'Config';


const app = express();

app.set('port', process.env.PORT || 5000);

app.use(cors({origin: 'http://tober.org'}));
app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/config', (req, res) => {
  const config: Config = {
    server: process.env.SERVER || 'localhost:5000',
    iceCast: {
      host: process.env.IC_HOST || 'http://localhost',
      port: +process.env.IC_PORT || 8000,
      mountPoint: process.env.IC_MOUNTPOINT || 'live.mp3'
    }
  };
  res.json(config);
});

app.all('*', (req, res) => {
  res.redirect('/');
});

export const server = http.createServer(app);
const io = require('socket.io')(server, {origins: '*:*'});

const pdClient = new PdClient(new net.Socket(), process.env.PD_HOST || '127.0.0.1', +process.env.PD_PORT || 5001);
pdClient.connect();

// Client socket id => Pd id
const userPdMappings: Map<string, number> = new Map();
const availablePdUsers: number[] = [];

for (let currentUser = 0; currentUser < PdClient.MAX_USERS; currentUser++) {
  availablePdUsers.push(currentUser);
}

const broadcastNumberOfConnectedClients = () => {
  io.emit('connected_clients', {
    connected: PdClient.MAX_USERS - availablePdUsers.length,
    total: PdClient.MAX_USERS,
  });
  console.log('No. of connected clients: ', PdClient.MAX_USERS - availablePdUsers.length);
  console.log(userPdMappings);
};


io.on('connection', (socket: Socket) => {
  console.log('Client connected. Socket id: ', socket.id);

  if (availablePdUsers.length < 1) {
    console.log('No more clients available');
    broadcastNumberOfConnectedClients();
    socket.emit('occupied', {message: 'there are currently no more drones available, please try again later'});
    return;
  }

  const pdUserId = availablePdUsers.pop();
  userPdMappings.set(socket.id, pdUserId);

  broadcastNumberOfConnectedClients();

  socket.on('disconnect', () => {
    const pdUser = userPdMappings.get(socket.id);
    if (pdUser === undefined) {
      console.log('Could not find pd user for client id: ', socket.id);
      return;
    }
    pdClient.exitUser(pdUser);
    availablePdUsers.push(pdUserId);
    userPdMappings.delete(socket.id);
    broadcastNumberOfConnectedClients();
    console.log('Client disconnected. Socket id: ', socket.id);
  });

  socket.on('init', (settings: SynthSettings) => {
    const pdUser = userPdMappings.get(socket.id);
    if (pdUser === undefined) {
      console.log('Could not find pd user for client id: ', socket.id);
      return;
    }
    pdClient.updateSynthSettings(pdUser, settings);
    pdClient.enterUser(pdUser);
    console.log('Initialized pdUser ', pdUser);
  });

  socket.on('value_change', (settings: SynthSettings) => {
    const pdUser = userPdMappings.get(socket.id);
    if (pdUser === undefined) {
      console.log('Could not find pd user for client id: ', socket.id);
      return;
    }
    pdClient.updateSynthSettings(pdUser, settings);
    console.log('Updated synth settings for pd user: ', pdUser);
  });
});

export default app;
