import React from 'react';
import '../App.css';
import {SynthSettings, UserSettings} from '../types/SynthSettings';


interface IProps {
  userSettings: UserSettings;
  synthSettings: SynthSettings;
}

const UserSettingsComponent: React.FC<IProps> = (props: IProps) => {

  const getSlider = (setting: any) => {
    // @ts-ignore
    return <input type="range" min={props.synthSettings[setting[0]].min} max={props.synthSettings[setting[0]].max} value={setting[1] as any} disabled={true}/>;
  };

  console.log(props.userSettings);

  return (
    <div className="user-settings">
      {Object.entries(props.userSettings.settings).map(setting => <div>{getSlider(setting)}</div>)}
    </div>
  );
};

export default UserSettingsComponent;
