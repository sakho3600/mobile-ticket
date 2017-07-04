import { Component, Input } from '@angular/core';

@Component({
    selector: 'not-support-layout',
    templateUrl: './not-support.component.html',
    styleUrls: ['./not-support.component.css']
})

export class NotSupportComponent {
    @Input() browserName: string;
}