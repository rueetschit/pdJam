export interface SynthSettings {
  frequency: SliderSetting;
  attack: SliderSetting;
  decay: SliderSetting;
  pause: SliderSetting;
  length: SliderSetting;
  modFreq: SliderSetting;
  modAmount: SliderSetting;
  modFreq2: SliderSetting;
  modFreq2Amount: SliderSetting;
  lfo: SliderSetting;
  reverb: SliderSetting;
  volume: SliderSetting;
}

export interface SliderSetting {
  min: number;
  max: number;
  value: number;
  enabled: boolean;
}

export enum SettingName {
  FREQUENCY = 'frequency',
  ATTACK = 'attack',
  DECAY = 'decay',
  PAUSE = 'pause',
  LENGTH = 'length',
  MOD_FREQ = 'modFreq',
  MOD_AMOUNT = 'modAmount',
  MOD_FREQ_2 = 'modFreq2',
  MOD_FREQ_2_AMOUNT = 'modFreq2Amount',
  LFO = 'lfo',
  REVERB = 'reverb',
  VOLUME = 'volume',
}

export interface Setting {
  setting: SettingName,
  value: number,
}