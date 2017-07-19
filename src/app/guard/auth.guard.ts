import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from 'ng2-translate';
import { Util } from '../util/util';
import { ServiceEntity } from '../entities/service.entity';
import { BranchService } from '../branch/branch.service';
import { BranchEntity } from '../entities/branch.entity';
import { AlertDialogService } from '../shared/alert-dialog/alert-dialog.service';
declare var MobileTicketAPI: any;
declare var ga: Function;

@Injectable()
export class AuthGuard implements CanActivate {

    private prevUrl: string = '/';
    private branchService: BranchService;
    private isNoSuchBranch = false;
    private isNoSuchVisit = false;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private branchSrvc: BranchService,
        private alertDialogService: AlertDialogService, private translate: TranslateService) {
        this.branchService = branchSrvc;
    }

    createTicket(bEntity: BranchEntity, sEntity: ServiceEntity, resolve) {
        MobileTicketAPI.setServiceSelection(sEntity);
        MobileTicketAPI.setBranchSelection(bEntity);

        MobileTicketAPI.createVisit((vstInfo) => {
            ga('send', {
                hitType: 'event',
                eventCategory: 'visit',
                eventAction: 'create',
                eventLabel: 'vist-create'
            });
            this.router.navigate(['ticket']);
            resolve(false);

        },
            (xhr, status, errorMessage) => {
                this.isNoSuchVisit = true;
                MobileTicketAPI.resetAllVars();
                this.router.navigate(['no_visit']);
                resolve(false);
            }
        );
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve, reject) => {
            var visitInfo = MobileTicketAPI.getCurrentVisit();
            let url = state.url;
            let branchId = route.queryParams['branch'];
            let visitId = route.queryParams['visit'];
            let checksum = route.queryParams['checksum'];


            if (this.isNoSuchBranch && url.startsWith('/no_branch')) {
                this.isNoSuchBranch = false;
                resolve(true);
            }
            else if (this.isNoSuchVisit && url.startsWith('/no_visit')) {
                this.isNoSuchVisit = false;
                resolve(true);
            }
            else if (url.startsWith('/branches')) {
                /**
                 * for qr-code format: http://XXXX/branches/{branchId}
                 * Redirect user to services page for specific branchId
                 */
                if (route.url.length === 2 && route.url[1].path) {
                    let id = route.url[1].path;
                    this.branchService.getBranchById(+id, (branchEntity: BranchEntity, isError: boolean) => {
                        if (!isError) {
                            MobileTicketAPI.getVisitStatus(
                                (visitObj: any) => {
                                    if (visitObj.status === 'CALLED' || visitObj.visitPosition !== null) {
                                        let alertMsg = '';
                                        this.translate.get('visit.onGoingVisit').subscribe((res: string) => {
                                            alertMsg = res;
                                            this.alertDialogService.activate(alertMsg).then(res => {
                                                resolve(true);
                                            }, () => {

                                            });
                                        });

                                    }
                                    else {
                                        MobileTicketAPI.setBranchSelection(branchEntity);
                                        this.router.navigate(['services']);
                                        resolve(false);
                                    }
                                },
                                (xhr, status, msg) => {
                                    MobileTicketAPI.setBranchSelection(branchEntity);
                                    this.router.navigate(['services']);
                                    resolve(false);
                                }
                            );
                        }
                        else {
                            let e = 'error';
                            this.isNoSuchBranch = true;
                            this.router.navigate(['no_branch']);
                            resolve(true);
                        }
                    });
                }
                /**
                 * for qr-code format: http://XXXX/branches/{branchId}/services/{serviceId}
                 * Redirect user to ticket screen by creating a visit for the given branchId & serviceId
                 */
                else if (route.url.length === 4 && route.url[1].path && route.url[3].path) {
                    let bEntity = new BranchEntity();
                    bEntity.id = route.url[1].path;
                    let sEntity = new ServiceEntity();
                    sEntity.id = +route.url[3].path;

                    this.branchService.getBranchById(+bEntity.id, (branchEntity: BranchEntity, isError: boolean) => {
                        if (!isError) {
                            MobileTicketAPI.getVisitStatus(
                                (visitObj: any) => {
                                    if (visitObj.status === 'CALLED' || visitObj.visitPosition !== null) {
                                       let alertMsg = '';
                                        this.translate.get('visit.onGoingVisit').subscribe((res: string) => {
                                            alertMsg = res;
                                            this.alertDialogService.activate(alertMsg).then(res => {
                                                resolve(true);
                                            }, () => {

                                            });
                                        });
                                    }
                                    else {
                                        this.createTicket(bEntity, sEntity, resolve);
                                    }
                                },
                                (xhr, status, msg) => {
                                    this.createTicket(bEntity, sEntity, resolve);
                                }
                            );
                        }
                        else {
                            let e = 'error';
                            this.isNoSuchBranch = true;
                            this.router.navigate(['no_branch']);
                            resolve(false);
                        }
                    });
                }
                else {
                    resolve(true);
                }

            }
            else if (url.startsWith('/services')) {
                if ((this.prevUrl.startsWith('/branches') ||
                    this.prevUrl === '/')) {
                    resolve(true);
                }
                else if (this.prevUrl.startsWith('/ticket') &&
                    (!visitInfo || visitInfo === null)) {
                    resolve(true);
                }
                else if ((visitInfo && visitInfo !== null)) {
                    this.router.navigate(['/branches']);
                    resolve(false);
                }
            }

            else if ((url.startsWith('/ticket') && ((branchId && visitId && checksum) ||
                ((visitInfo !== null && visitInfo) && visitInfo.branchId && visitInfo.visitId && visitInfo.checksum)))) {
                resolve(true);
            }
            else if (visitInfo) {
                MobileTicketAPI.getVisitStatus(
                    (visitObj: any) => {
                        if (visitObj.status === "CALLED" || visitObj.visitPosition !== null) {
                            this.router.navigate(['ticket']);
                            resolve(true);
                        }
                        else {
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
            else {
                this.router.navigate(['/branches']);
                resolve(false);
            }

            if (!(this.prevUrl.startsWith('/branches') && url.startsWith('/ticket'))) {
                this.prevUrl = url;
            }

        });
    }
}
