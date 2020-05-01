import {Socket} from 'net';
import {SynthSettings} from 'SynthSettings';


interface PdUser {
  id: number;
  settings: SynthSettings;
}

class PdClient {

  public static MAX_USERS = 20;

  private connected = false;
  private currentUsers: PdUser[] = [];

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
    this.currentUsers = this.currentUsers.filter(u => u.id !== pdUserId);
  }

  updateSynthSettings(pdUserId: number, settings: SynthSettings) {
    if (!this.connected) {
      console.log('Cannot send message. Not connected to Pd');
      return;
    }

    const user = this.currentUsers.find(u => u.id === pdUserId);
    if (user !== undefined) {
      user.settings = {...user.settings, ...settings};
    } else {
      this.currentUsers.push({id: pdUserId, settings: settings});
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

  getCurrentUsers(): PdUser[] {
    return this.currentUsers;
  }
}
export default PdClient;