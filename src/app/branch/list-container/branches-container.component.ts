import { Component } from '@angular/core';
@Component({
  selector: 'app-branches-container',
  templateUrl: './branches-container-tmpl.html',
  styleUrls: ['./branches-container.css', '../../shared/css/common-styles.css']
})
export class BranchesContainerComponent {
  public subHeadingOne = "Welcome to Qmatic";
  public subHeadingTwo = "Do you want to get in line for one of our services? Start by selecting location.";
}

