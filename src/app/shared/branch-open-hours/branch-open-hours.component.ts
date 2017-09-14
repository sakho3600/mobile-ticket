import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Config } from '../../config/config';
import { BranchOpenHoursValidator } from '../../util/branch-open-hours-validator'
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-open-hours',
  templateUrl: './branch-open-hours-tmpl.html',
  styleUrls: ['./branch-open-hours.component.css']
})

export class BranchOpenHoursComponent {

  public openHours;

  constructor(private config: Config, private translate: TranslateService, private router: Router) {
 
  }
 
  ngOnInit() {
    if((new BranchOpenHoursValidator(this.config)).openHoursValid()){
           this.router.navigate(['branches']);
    }
     this.openHours = [];
    let config =  this.config.getConfig("branch_open_hours");

    if(config != null)
      for(var i=0; i < config.length; i++ ){
        let element = config[i];
        let openHour = (document.dir == "rtl") ? element.display_to+"-"+element.display_from : element.display_from+"-"+element.display_to;

        //hide elements from message
        if(!('show' in element) || element.show != "true"){
            continue;
        }
        
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

}
