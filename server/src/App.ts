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

io.on('connection', (socket: Socket) => {
  console.log('Client connected. Socket id: ', socket.id);

  // send something to client:
  // io.emit('hello', socket.id);

  socket.on('osc_frequency', (frequency: number) => {
    console.log('Received new osc frequency: ', frequency);
    pdClient.send(`${frequency};`);
  });
});

export default app;
