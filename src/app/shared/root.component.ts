import { Component} from '@angular/core';
import { Config } from '../config/config';

declare var ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './root-tmpl.html'
})
export class RootComponent {
  constructor(private config: Config) {
    let track_id = config.getConfig('ga_track_id');
    if (track_id && track_id !== '') {
      ga('create', track_id, 'auto');
      ga('send', 'pageview');
    }
  }
}
