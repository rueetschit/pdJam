import express from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import * as path from 'path';


const app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, '../../client')));

export const server = http.createServer(app);
const io = require('socket.io')(server);

const port = require('port');
// @ts-ignore
const pd = new port({
  write: 5001,
  'flags': {
    'noprefs': true,
    'nogui': false,
    'stderr': true,
    'path': 'relatvie/path/to/dir',
    'open': 'patch.pd'
  }
});

pd.create();

pd.on('connect', (socket: any) => {
  pd.write('Hello from node!;\n');
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
