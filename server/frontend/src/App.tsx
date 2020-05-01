import React from 'react';
import './App.css';
import AudioPlayer from './components/AudioPlayer';
import SynthControls from './components/SynthControls';
import {Configuration} from './types/Configuration';
import socketIOClient from 'socket.io-client';
import {Setting, SynthSettings} from './types/SynthSettings';
import SynthSettingsService from './services/SynthSettingsService';
import {debounceTime} from 'rxjs/operators';


interface IProps {
}

interface IState {
  config: Configuration | undefined;
  numOfConnectedClients: number;
  totalNumOfConnectedClients: number;
  synthSettings: SynthSettings;
  disabled: boolean,
}

class App extends React.Component<IProps, IState> {

  private socket: any = undefined;
  private synthSettingsService: SynthSettingsService;

  constructor(props: IProps) {
    super(props);
    this.state = {
      config: undefined,
      numOfConnectedClients: 0,
      totalNumOfConnectedClients: 0,
      disabled: false,
      synthSettings: {
        frequency: {
          min: 200, max: 800,
          value: this.randomIntBetween(200, 800),
          enabled: true,
        },
        attack: {
          value: this.randomIntBetween(100, 5000),
          min: 100, max: 5000,
          enabled: true,
        },
        decay: {
          value: this.randomIntBetween(100, 5000),
          min: 100, max: 5000,
          enabled: true,
        },
        pause: {
          value: this.randomIntBetween(500, 20000),
          min: 500, max: 20000,
          enabled: true,
        },
        length: {
          value: this.randomIntBetween(100, 20000),
          min: 100, max: 20000,
          enabled: true,
        },
        modFreq: {
          value: this.randomIntBetween(0, 5000),
          min: 0, max: 5000,
          enabled: true,
        },
        modAmount: {
          value: this.randomIntBetween(0, 700),
          min: 0, max: 700,
          enabled: true,
        },
        modFreq2: {
          value: this.randomIntBetween(0, 40),
          min: 0, max: 40,
          enabled: true,
        },
        modFreq2Amount: {
          value: this.randomIntBetween(0, 100),
          min: 0, max: 100,
          enabled: true,
        },
        lfo: {
          value: this.randomIntBetween(0, 100),
          min: 0, max: 100,
          enabled: true,
        },
        reverb: {
          value: this.randomIntBetween(0, 100),
          min: 0, max: 100,
          enabled: true,
        },
        volume: {
          value: this.randomIntBetween(0, 100),
          min: 0, max: 100,
          enabled: true,
        },
      }
    };
    this.synthSettingsService = new SynthSettingsService();
  }

  async componentDidMount(): Promise<void> {
    const {synthSettings} = this.state;
    await this.loadConfiguration();
    if (!this.state.config) return;
    this.socket = socketIOClient(this.state.config.server);

    this.socket.on('connected_clients', (message: any) => {
      this.setState({
        numOfConnectedClients: message.connected,
        totalNumOfConnectedClients: message.total,
      });
      console.log('Currently connected clients: ', message.connected);
    });

    // send initial (random) values
    this.socket.emit('init', {
      frequency: synthSettings.frequency.value,
      attack: synthSettings.attack.value,
      decay: synthSettings.decay.value,
      pause: synthSettings.pause.value,
      length: synthSettings.length.value,
      modFreq: synthSettings.modFreq.value,
      modAmount: synthSettings.modAmount.value,
      modFreq2: synthSettings.modFreq2.value,
      modFreq2Amount: synthSettings.modFreq2Amount.value,
      lfo: synthSettings.lfo.value,
      reverb: synthSettings.reverb.value,
      volume: synthSettings.volume.value,
    });

    /* TODO: not implemented for now
    socket.on('pdjam_error', (message) => {
      alert(`There was an error: ${message.message}`);
      window.location.href = '/5xx.html';
    });
     */

    this.socket.on('user_settings_changed', (userSettings: any) => {
      console.log('User settings changed: ', userSettings);
      // TODO
    });

    this.socket.on('occupied', (message: any) => {
      alert(message.message);

      this.setState({
        disabled: true,
        synthSettings: {
          frequency: {...this.state.synthSettings.frequency, enabled: false},
          attack: {...this.state.synthSettings.attack, enabled: false},
          decay: {...this.state.synthSettings.decay, enabled: false},
          pause: {...this.state.synthSettings.pause, enabled: false},
          length: {...this.state.synthSettings.length, enabled: false},
          modFreq: {...this.state.synthSettings.modFreq, enabled: false},
          modAmount: {...this.state.synthSettings.modAmount, enabled: false},
          modFreq2: {...this.state.synthSettings.modFreq2, enabled: false},
          modFreq2Amount: {...this.state.synthSettings.modFreq2Amount, enabled: false},
          lfo: {...this.state.synthSettings.lfo, enabled: false},
          reverb: {...this.state.synthSettings.reverb, enabled: false},
          volume: {...this.state.synthSettings.volume, enabled: false},
        }
      });
    });

    this.synthSettingsService.onSettingsChanged()
      .pipe(debounceTime(200))
      .subscribe((setting: Setting) => {
        if (!this.socket) return;
        this.socket.emit('value_change', {[setting.setting]: setting.value});
      });
  }

  async loadConfiguration() {
    try {
      const response = await fetch('/api/config');
      const config = await response.json();
      this.setState({config: config});
      console.log('Got config: ', config);
    } catch (e) {
      console.log('Error fetching config', e);
    }
  }

  // min and max included
  randomIntBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  render() {
    const {config, synthSettings, numOfConnectedClients, totalNumOfConnectedClients, disabled} = this.state;

    return (
      <div className="wrapper">
        <br/>
        <br/>
        <span id="title">This is your <i>personal drone</i>. </span><br/>
        <span id="subtitle">Use the sliders to shape its sound, but expect a delay of some seconds.</span>

        <AudioPlayer iceCastConfig={config?.iceCast}/>

        <SynthControls
          settings={synthSettings}
          numOfConnectedClients={numOfConnectedClients}
          totalNumOfConnectedClients={totalNumOfConnectedClients}
          showDisabledMessage={disabled}
          synthSettingsService={this.synthSettingsService}
        />
      </div>
    )
  }
}

export default App;
