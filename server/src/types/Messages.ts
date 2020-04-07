import {SynthSettings} from 'SynthSettings';

export interface SynthSettingsMessage {
  pdUser: number;
  settings: SynthSettings;
}

export interface ClientDisconnectMessage {
  pdUser: number;
}