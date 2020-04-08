import express from 'express';
import * as http from 'http';
import * as net from 'net';
import PdClient from './PdClient';
import {ClientDisconnectMessage, SynthSettingsMessage} from 'Messages.ts';

const CONNECTION_DELAY = 5000;
const app = express();

app.set('port', process.env.PORT || 5000);

app.all('*', (req, res) => {
  res.redirect('/');
});

export const server = http.createServer(app);

// delaying initialization to wait until proxy is ready
setTimeout(() => {
  const socket = require('socket.io-client')(process.env.PROXY || 'http://localhost:5002/pdjam-server');
  console.log('Connected to proxy');

  const pdClient = new PdClient(new net.Socket(), process.env.PD_HOST || '127.0.0.1', +process.env.PD_PORT || 5001);
  pdClient.connect();

  socket.on('client_init', (msg: SynthSettingsMessage) => {
    pdClient.updateSynthSettings(msg.pdUser, msg.settings);
    pdClient.enterUser(msg.pdUser);
    console.log('Initialized pd user: ', msg.pdUser);
  });

  socket.on('client_disconnect', (msg: ClientDisconnectMessage) => {
    pdClient.exitUser(msg.pdUser);
    console.log('Disconnected pd user: ', msg.pdUser);
  });

  socket.on('update_settings', (msg: SynthSettingsMessage) => {
    pdClient.updateSynthSettings(msg.pdUser, msg.settings);
    console.log('Updated synth settings for pd user: ', msg.pdUser);
  });
}, CONNECTION_DELAY);

export default app;
