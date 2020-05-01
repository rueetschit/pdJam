import React from 'react';
import '../App.css';
import {Setting, SynthSettings} from '../types/SynthSettings';


interface IProps {
  settings: SynthSettings;
  numOfConnectedClients: number;
  totalNumOfConnectedClients: number;
  onChangeSetting: (setting: Setting, value: number) => void;
  showDisabledMessage: boolean;
}

interface IState {
}


class SynthControls extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render() {
    const {settings, onChangeSetting, showDisabledMessage} = this.props;

    return (
      <div>
        {showDisabledMessage &&
        <div id="occupied-message">
          <p><strong>All drones are occupied right now, please have patience...</strong></p>
          <a id="retry-button" href="/">retry</a>
        </div>}

        <div className="synth-controls">
          <div>
            <label htmlFor="frequency-slider">pitch</label><br/>
            <input
              type="range"
              min={settings.frequency.min}
              max={settings.frequency.max}
              defaultValue={settings.frequency.value}
              disabled={!settings.frequency.enabled}
              onChange={(e) => onChangeSetting(Setting.FREQUENCY, parseInt(e.target.value))}
              id="frequency-slider"
            />
          </div>

          <div>
            <label htmlFor="attack-slider">urgency</label>
            <input
              type="range"
              min={settings.attack.min}
              max={settings.attack.max}
              defaultValue={settings.attack.value}
              disabled={!settings.attack.enabled}
              onChange={(e) => onChangeSetting(Setting.ATTACK, parseInt(e.target.value))}
              id="attack-slider"/>
          </div>

          <div>
            <label htmlFor="decay-slider">ease off</label>
            <input
              type="range"
              min={settings.decay.min}
              max={settings.decay.max}
              defaultValue={settings.decay.value}
              disabled={!settings.decay.enabled}
              onChange={(e) => onChangeSetting(Setting.DECAY, parseInt(e.target.value))}
              id="decay-slider"/>
          </div>

          <div>
            <label htmlFor="pause-slider">decelerate</label>
            <input
              type="range"
              min={settings.pause.min}
              max={settings.pause.max}
              defaultValue={settings.pause.value}
              disabled={!settings.pause.enabled}
              id="pause-slider"
              onChange={(e) => onChangeSetting(Setting.PAUSE, parseInt(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="length-slider">endurance</label>
            <input
              type="range"
              min={settings.length.min}
              max={settings.length.max}
              defaultValue={settings.length.value}
              disabled={!settings.length.enabled}
              onChange={(e) => onChangeSetting(Setting.LENGTH, parseInt(e.target.value))}
              id="length-slider"
            />
          </div>

          <div>
            <label htmlFor="modfreq-slider">trill frequency</label>
            <input
              type="range"
              min={settings.modFreq.min}
              max={settings.modFreq.max}
              defaultValue={settings.modFreq.value}
              disabled={!settings.modFreq.enabled}
              onChange={(e) => onChangeSetting(Setting.MOD_FREQ, parseInt(e.target.value))}
              id="modfreq-slider"
            />
          </div>

          <div>
            <label htmlFor="modamount-slider">trill amount</label>
            <input
              type="range"
              min={settings.modAmount.min}
              max={settings.modAmount.max}
              defaultValue={settings.modAmount.value}
              disabled={!settings.modAmount.enabled}
              onChange={(e) => onChangeSetting(Setting.MOD_AMOUNT, parseInt(e.target.value))}
              id="modamount-slider"
            />
          </div>

          <div>
            <label htmlFor="modfreq2-slider">shiver frequency</label>
            <input
              type="range"
              min={settings.modFreq2.min}
              max={settings.modFreq2.max}
              defaultValue={settings.modFreq2.value}
              disabled={!settings.modFreq2.enabled}
              onChange={(e) => onChangeSetting(Setting.MOD_FREQ_2, parseInt(e.target.value))}
              id="modfreq2-slider"
            />
          </div>

          <div>
            <label htmlFor="modamount2-slider">shiver amount</label>
            <input
              type="range"
              min={settings.modFreq2Amount.min}
              max={settings.modFreq2Amount.max}
              defaultValue={settings.modFreq2Amount.value}
              disabled={!settings.modFreq2Amount.enabled}
              onChange={(e) => onChangeSetting(Setting.MOD_FREQ_2_AMOUNT, parseInt(e.target.value))}
              id="modamount2-slider"
            />
          </div>

          <div>
            <label htmlFor="lfo-slider">dissonance</label>
            <input
              type="range"
              min={settings.lfo.min}
              max={settings.lfo.max}
              defaultValue={settings.lfo.value}
              disabled={!settings.lfo.enabled}
              onChange={(e) => onChangeSetting(Setting.LFO, parseInt(e.target.value))}
              id="lfo-slider"
            />
          </div>

          <div>
            <label htmlFor="reverb-slider">dampness</label>
            <input
              type="range"
              min={settings.reverb.min}
              max={settings.reverb.max}
              defaultValue={settings.reverb.value}
              disabled={!settings.reverb.enabled}
              onChange={(e) => onChangeSetting(Setting.REVERB, parseInt(e.target.value))}
              id="reverb-slider"
            />
          </div>

          <div>
            <label htmlFor="volume-slider">power</label>
            <input
              type="range"
              min={settings.volume.min}
              max={settings.volume.max}
              defaultValue={settings.volume.value}
              disabled={!settings.volume.enabled}
              onChange={(e) => onChangeSetting(Setting.VOLUME, parseInt(e.target.value))}
              id="volume-slider"
            />
          </div>
          {showDisabledMessage && <div id="disabled-overlay"/>}
        </div>

        <br/>
        <br/>
        <div id="clients"><span>Drones in use: </span>
          <span id="number-of-connected-clients">{this.props.numOfConnectedClients}</span>
          <span>/</span>
          <span id="total-number-of-clients">{this.props.totalNumOfConnectedClients}</span>
        </div>
      </div>
    )
  }
}

export default SynthControls;
