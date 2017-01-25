import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-network-message',
  templateUrl: './connectivity-message-tmpl.html',
  styleUrls: ['./connectivity-message.component.css', '../../shared/css/common-styles.css']
})

export class ConnectivityMessageComponent {
  private loaderResource: string = "app/resources/loader.svg";
  private textMsg;
  constructor(private translate: TranslateService) {
    this.translate.get('connection.issue_with_connection').subscribe((res:string) => {
      this.textMsg = res;
    });
  }

}
