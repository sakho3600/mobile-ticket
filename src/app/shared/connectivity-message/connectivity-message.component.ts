import { Component } from '@angular/core';

@Component({
  selector: 'app-network-message',
  templateUrl: './connectivity-message-tmpl.html',
  styleUrls: ['./connectivity-message.component.css', '../../shared/css/common-styles.css']
})

export class ConnectivityMessageComponent {
  private loaderResource: string = "app/resources/loader.svg";
}
