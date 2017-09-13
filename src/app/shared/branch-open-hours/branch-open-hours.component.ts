import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Config } from '../../config/config';

@Component({
  selector: 'app-branch-open-hours',
  templateUrl: './branch-open-hours-tmpl.html',
  styleUrls: ['./branch-open-hours.component.css']
})

export class BranchOpenHoursComponent {

  private isRtl: boolean;
  public openHours;

  constructor(private config: Config, private translate: TranslateService) {
 
  }
 
  ngOnInit() {
     this.setRtlStyles();
     this.openHours = [];
    let config =  this.config.getConfig("branch_open_hours");

    if(config != null)
      for(var i=0; i < config.length; i++ ){
        let element = config[i];
        let openHour = element.display_from+"-"+element.display_to;
        
        this.translate.get(element.translation_key).subscribe((res: string) => {
          if(element.display_from == "" || element.display_to == ""){
            this.translate.get('open_hours.closed').subscribe((closed: string) => {
                this.openHours.push({
                "day":res,
                "fromAndTo":closed
              })
            });
          }else{
            this.openHours.push({
              "day":res,
              "fromAndTo":openHour
            })
          }
        });
       };
  }

  setRtlStyles(){
    if(document.dir == "rtl"){
      this.isRtl = true;
    }else{
      this.isRtl = false;
    }
  }
}
