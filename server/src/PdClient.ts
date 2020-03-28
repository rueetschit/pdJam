import {Socket} from 'net';


class PdClient {

  private connected = false;

  constructor(private socket: Socket,
              private host: string,
              private port: number) {

    this.connect = this.connect.bind(this);
    this.send = this.send.bind(this);
  }

  connect(): void {
    this.socket.connect(this.port, this.host, () => {
      this.connected = true;
      console.log('Connected to Pd');
    });
  }

  send(message: string) {
    if (!this.connected) {
      console.log('Cannot send message. Not connected to Pd');
      return;
    }
    this.socket.write(message);
  }

}
export default PdClient;