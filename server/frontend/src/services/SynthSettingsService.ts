import {Subject, Observable} from 'rxjs';
import {SettingName} from '../types/SynthSettings';


class SynthSettingsService {

  private onChangeSettings$: Subject<any>;

  constructor() {
    this.onChangeSettings$ = new Subject();
  }

  updateSettings(setting: SettingName, value: number): void {
    this.onChangeSettings$.next({setting: setting, value: value});
  }

  onSettingsChanged(): Observable<any> {
    return this.onChangeSettings$.asObservable();
  }

}

export default SynthSettingsService;