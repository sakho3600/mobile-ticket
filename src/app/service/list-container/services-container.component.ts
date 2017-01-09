import { Component } from '@angular/core';
import { BranchService } from '../../branch/branch.service';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { ServiceEntity } from '../../entities/service.entity';
import { RetryService } from '../../shared/retry.service';

declare var MobileTicketAPI: any;
declare var ga: Function;

@Component({
    selector: 'app-services-container',
    templateUrl: './services-container-tmpl.html',
    styleUrls: ['./services-container.css', '../../shared/css/common-styles.css']
})

export class ServicesContainerComponent {
    public subHeadingTwo;
    public showListShadow;
    public selectedServiceId: number;
    private showNetWorkError = false;

    constructor(private branchService: BranchService, public router: Router, private translate: TranslateService
        , private retryService: RetryService) {
        this.translate.get('service.defaultTitle').subscribe((res: string) => {
            document.title = res;
        });

        this.translate.get('service.selectService').subscribe((res: string) => {
            this.subHeadingTwo = res + " " + branchService.getSelectedBranch() + ":";
        });
    }

    showHideNetworkError(value: boolean) {
        this.showNetWorkError = value;
    }

    onServiceListHeightUpdate(boolShowListShadow: boolean) {
        this.showListShadow = boolShowListShadow;
    }

    saveSelectedService(selectedServiceId: number) {
        this.selectedServiceId = selectedServiceId;
    }

    onTakeTicket() {
        this.takeTicket();
    }

    private takeTicket(): void {
      
        if (this.selectedServiceId) {
            let clientId;
            ga(function (tracker) {
                if (tracker.get('clientId')) {
                    clientId = tracker.get('clientId');
                }
                else {
                    clientId = '';
                }
            });

            MobileTicketAPI.createVisit(clientId,
                (visitInfo) => {
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'Ticket',
                        eventAction: 'create',
                        eventLabel: 'vist-create'
                    });

                    this.router.navigate(['ticket']);
                },
                (xhr, status, errorMessage) => {
                    this.showHideNetworkError(true);
                    this.retryService.retry(() => {
                        let branchId = MobileTicketAPI.getSelectedBranch().id;
                        MobileTicketAPI.getBranchInformation(branchId,
                            () => {
                                this.retryService.abortRetry();
                                this.showHideNetworkError(false);
                            }, () => {
                                //Do nothing on error
                            });
                    });
                }
            );
        }
    }
}
