import React from 'react';
import {IceCastConfig} from '../types/Configuration';
import '../App.css';

interface IProps {
  iceCastConfig: IceCastConfig | undefined;
}

interface IState {}


class AudioPlayer extends React.Component<IProps, IState>{

  private audioPlayerRef = React.createRef<HTMLAudioElement>();
  private audioPlayerButtonRef = React.createRef<HTMLButtonElement>();
  private audioPlayerSource = React.createRef<HTMLSourceElement>();

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    if (this.props.iceCastConfig !== prevProps.iceCastConfig) {
      this.audioPlayerSource!.current!.src = `${this.props.iceCastConfig!.host}:${this.props.iceCastConfig!.port}/${this.props.iceCastConfig!.mountPoint}`;
      this.audioPlayerRef!.current!.load();
    }
  }

  playAudio() {
    const player = this.audioPlayerRef.current;
    const playerButton = this.audioPlayerButtonRef.current;
    if (!player || !playerButton) return;

    if (player.paused) {
      player.play();
      playerButton.className = "";
      playerButton!.className = "pause";
    } else {
      player.pause();
      playerButton!.className = "";
      playerButton!.className = "play";
    }
  };

  setVolume(volume: number) {
    const player = this.audioPlayerRef.current;
    if (!player) return;
    player.volume = volume;
  };

  render() {
    return (
      <div className="audio-player">

        <audio id="audio-stream-player" ref={this.audioPlayerRef}>
          <source id="audio-stream-src" ref={this.audioPlayerSource}/>
          Your browser does not support the audio element.
        </audio>

        <div id="audioplayer">
          <button id="pButton" className="play" onClick={() => this.playAudio()} ref={this.audioPlayerButtonRef}/>

          <div id="volume_control">
            <input type="range"
                   onChange={(e) => this.setVolume(parseFloat(e.target.value))}
                   id="rngVolume"
                   min="0"
                   max="1"
                   step="0.01"
                   defaultValue={this.audioPlayerRef ? this.audioPlayerRef.current?.volume : 1}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default AudioPlayer;
