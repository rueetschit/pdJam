import {Socket} from 'net';
import {SynthSettings} from 'SynthSettings';


class PdClient {

  public static MAX_USERS = 20;
  private connected = false;

  constructor(private socket: Socket,
              private host: string,
              private port: number) {

    this.connect = this.connect.bind(this);
    this.send = this.send.bind(this);
    this.updateSynthSettings = this.updateSynthSettings.bind(this);
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

  enterUser(pdUserId: number) {
    if (!this.connected) {
      console.log('Cannot send message. Not connected to Pd');
      return;
    }
    this.send(`${pdUserId} start bang;`);
  }

  exitUser(pdUserId: number) {
    if (!this.connected) {
      console.log('Cannot send message. Not connected to Pd');
      return;
    }
    this.send(`${pdUserId} stop bang;`);
  }

  updateSynthSettings(pdUserId: number, settings: SynthSettings) {
    if (!this.connected) {
      console.log('Cannot send message. Not connected to Pd');
      return;
    }
    for (let setting in settings) {
      if (setting === 'reverb' || setting === 'volume') {
        // need to map to 0..1 for these settings
        settings[setting] = settings[setting] / 100;
      }
      if (setting === 'modFreq2Amount') {
        settings[setting] = settings[setting] / 1000;
      }
      // @ts-ignore
      this.send(`${pdUserId} ${setting} ${settings[setting]} ;`);
      // @ts-ignore
      console.log(`User ${pdUserId}, setting ${setting}: ${settings[setting]}`);
    }
  }
}
export default PdClient;