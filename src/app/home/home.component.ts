import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

/**
 * Homecomponent is the page that the displays the multiple components to view tabs.
 */
export class HomeComponent {
  tabs = ['First', 'Second', 'Third'];
  selected = new FormControl(0);
}
