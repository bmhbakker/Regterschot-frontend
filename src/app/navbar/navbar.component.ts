import {Component, ElementRef, ViewChild} from '@angular/core';
import {GlobalComponent} from "../global-component";
import {Graph} from "../model/graph.model";

import {HttpService} from "../service/http-service.service";
import {ChartType} from "angular-google-charts";
import {BrokerConnectionComponent} from "../brokerconnection/brokerconnection.component";
import {HttpClient} from "@angular/common/http";

@Component({
  providers: [BrokerConnectionComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild('sidenav') sidenav: any;
  public sensorArray: any;
  div = GlobalComponent.div;

  constructor(private el: ElementRef,
              private httpService: HttpService,
              private comp: BrokerConnectionComponent,
              private httpClient: HttpClient) {
    this.sensorArray = [];
  }

  ngOnInit(): void {
    this.httpService.getSensorData().subscribe((sensorDataObject) => {
      for (let responseKey in sensorDataObject) {
        // @ts-ignore

        const rep = sensorDataObject[responseKey];
        const sensorId = rep.sensorId.toString();
        const sensorName = rep.sensorName.toString();

        let graphType = '';
        if (rep.graphTypeDTOList[0] !== undefined) {
          graphType = rep.graphTypeDTOList[0].graphType.toString();
        }

        this.sensorArray.push([sensorId, sensorName, graphType]);
      }
    });
  }

  onResize({ev}: { ev: any }) {
    if (ev.contentRect.width > 500) {
    }
  }

  addGraph(sensorName: string, sensorType: string): void {
    this.sensorArray.forEach((sensor: String) => {
      if (sensor[1] === sensorName) {
        let chart = ChartType.LineChart;
        let settings: any = [];
        switch (sensorType) {
          case "linechart":
            GlobalComponent.tabArray[GlobalComponent.tabId].graphs.push(new Graph(sensorName, "linechart", GlobalComponent.tabId, []));
            this.httpClient.post('http://localhost:8080/regterschotracing/graphs/' + GlobalComponent.tabId + '?graphid=' + sensor[0] + '&sensorName=' + sensorName + "&token=" + sessionStorage.getItem("JWT"), "").subscribe();
            break;

          case "gauge":
            chart = ChartType.Gauge
            this.httpService.getSettings(sensorName).subscribe((sensorSettingsDataObject) => {
              // @ts-ignore
              settings = sensorSettingsDataObject[0];
              GlobalComponent.tabArray[GlobalComponent.tabId].graphs.push(new Graph(sensorName, "gauge", GlobalComponent.tabId, Object.keys(settings).map(key => settings[key])));
              this.httpClient.post('http://localhost:8080/regterschotracing/graphs/' + GlobalComponent.tabId + '?graphid=' + sensor[0] + '&sensorName=' + sensorName + "&token=" + sessionStorage.getItem("JWT"), "").subscribe();
              this.comp.addSettings(sensorName);
            });
            break;
        }
      }
    });
  }
}
