import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate';
import { TicketInfoContainerComponent } from '../container/ticket-info-container.component';
import { ConfirmDialogService } from "../../shared/confirm-dialog/confirm-dialog.service";


@Injectable()
export class VisitCancelLeavelineGuard implements CanDeactivate<TicketInfoContainerComponent> {

    public confirmMsg: string;
    constructor(private confirmDialogService: ConfirmDialogService, private translate: TranslateService) {
        
        this.translate.get('ticketInfo.leaveVisitConfirmMsg').subscribe((res: string) => {
            this.confirmMsg = res;
        });
    }
    canDeactivate(component: TicketInfoContainerComponent) {
        if (component.getVisitCancelCalled()) {
            return true;
        }
        else if (!component.isTicketEndedOrDeleted && !component.isVisitCall && !component.isVisitNotFound) {
            if (!component.isVisitCanceledOnce()) {
                this.confirmDialogService.activate(this.confirmMsg).then(res => {
                    if (res === true) {
                        component.setVisitCancelCalled(true);
                        component.cancelVisit();
                        return true;

                    }
                    else {
                        return false;
                    }

                });
            }
            else if (component.isVisitCanceledThroughLeaveLineBtn()) {
                component.setVisitCancelCalled(true);
                return true;
            }
        }
        else {
            return true;
        }
    }
}