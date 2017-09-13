import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'open-hour-item',
  templateUrl: './open-hour-item-tmpl.html',
  styleUrls: ['./open-hour-item.component.css']
})

export class OpenHourItemComponent {
  @Input() public day: string
  @Input() public fromAndTo: string

  constructor(private translate: TranslateService) {
 
  } 
}
