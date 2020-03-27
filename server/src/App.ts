import express from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import * as path from 'path';
import * as net from 'net';


const app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, '../../client')));

export const server = http.createServer(app);
const io = require('socket.io')(server);

const pdClient = new net.Socket();
pdClient.connect(5001, '127.0.0.1', () => {
  console.log('Connected');
  pdClient.write('42;');
});

io.on('connection', (socket: Socket) => {
  console.log('Connected client: ', socket.id);
  io.emit('hello', socket.id);

  socket.on('pd_controls', (data) => {
    console.log('received data from client: ', data);
    // TODO: talk to pure data
  });
});

export default app;
