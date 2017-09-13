import { Config } from '../config/config';

export class BranchOpenHoursValidator {

    constructor(private config : Config){

    }

   public  openHoursValid(){
       let entries = this.config.getConfig("branch_open_hours");
       if(entries == null){
           return false;
       }else{
           let day : number;
           var now = new Date();
           day = now.getDay();
           var hours = now.getHours();
           var minutes = now.getMinutes();
           var openHours = entries[day];
           var from = openHours.from.split(":");
           var to = openHours.to.split(":");

           var openFrom = new Date();
           openFrom.setHours(from[0]);
           openFrom.setMinutes(from[1]);

            var openTo = new Date();
           openTo.setHours(to[0]);
           openTo.setMinutes(to[1]);
           
           return openFrom < now && openTo > now || openFrom == now ||  openTo == now;           
       }
   }
}