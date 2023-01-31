import {Component, OnInit} from '@angular/core';
import {HttpService} from "../service/http-service.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
/**
 * Generates the overview to watch all races
 */
export class OverviewComponent implements OnInit {


  constructor(private http: HttpService) {
  }

  races: any[] = [];


  ngOnInit(): void {
    this.http.getRaces().subscribe((races: any) => {
      this.races = races
    });
  }
}




