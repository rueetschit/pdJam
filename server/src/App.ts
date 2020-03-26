import express from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import * as path from 'path';


const app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, '../../client')));

export const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket: Socket) => {
  console.log('Connected client: ', socket.id);
  io.emit('hello', socket.id);

  /*
  socket.on('start_sequence', () => {
    io.emit('start_sequence', {});
  });
  */
});

export default app;
