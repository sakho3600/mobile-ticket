import {Injectable} from '@angular/core';

@Injectable()
export class AlertDialogService {
  activate: (message?: string, title?: string) => Promise<boolean>;
}
