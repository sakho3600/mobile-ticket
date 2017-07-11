import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-network-message',
  templateUrl: './connectivity-message-tmpl.html',
  styleUrls: ['./connectivity-message.component.css']
})

export class ConnectivityMessageComponent {
  private _loaderResource: string = "app/resources/loader.svg";
  private _textMsg: string;

  constructor(private translate: TranslateService) {
    this.translate.get('connection.issue_with_connection').subscribe((res:string) => {
      this._textMsg = res;
    });
  }

  get loaderResource(): string { 
    return this._loaderResource; 
  }

  get textMsg(): string { 
    return this._textMsg; 
  }

}
