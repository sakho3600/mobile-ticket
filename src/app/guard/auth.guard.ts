import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

declare var MobileTicketAPI: any;

@Injectable()
export class AuthGuard implements CanActivate {
    

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Promise<boolean>{
        return new Promise((resolve, reject) => {
            var visitInfo = MobileTicketAPI.getCurrentVisit();
            if(visitInfo){
                MobileTicketAPI.getVisitStatus(
                    (visitObj: any) => {
                        if(visitObj.status == "VISIT_CALL" || visitObj.visitPosition != -1){
                            resolve(true);
                        }
                        else{
                            this.router.navigate(['/branches']);
                            resolve(false);
                        }
                    },
                    (xhr, status, msg) => {
                        this.router.navigate(['/branches']);
                        resolve(false);
                    }
                );
            }
            else{
                this.router.navigate(['/branches']);
                resolve(false);
            }
        });
    }
}