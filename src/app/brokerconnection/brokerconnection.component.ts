import {Component, OnInit} from '@angular/core';
import {IMqttMessage, IMqttServiceOptions, MqttService} from "ngx-mqtt";
import {Subscription, throwError} from "rxjs";
import {HttpService} from "../service/http-service.service";
import {HttpClient} from "@angular/common/http";
import {IClientSubscribeOptions} from "mqtt";
import {Graph} from "../model/graph.model";
import {Tab} from "../model/tab.model";
import {GlobalComponent} from "../global-component";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {FormControl} from "@angular/forms";
import {ChartType} from "angular-google-charts";

declare var google: any;

@Component({
  selector: 'app-brokerconnection',
  templateUrl: './brokerconnection.component.html',
  styleUrls: ['./brokerconnection.component.scss']
})

export class BrokerConnectionComponent implements OnInit {
  private sensors: any[];
  public readyToGo: String = '';
  private readonly sensorsDataList: any[];
  private readonly tabIndices: any[];
  private readonly sensorDivsCreatedForTabs: any[];

  [key: string]: any;

  tabArray = GlobalComponent.tabArray;
  graphs: Graph[] = [];
  selected = new FormControl(0);

  constructor(private _mqttService: MqttService,
              private httpService: HttpService,
              public httpClient: HttpClient) {
    this.client = this._mqttService;
    this.sensors = [];
    this.sensorsDataList = [];
    this.tabIndices = [];
    this.sensorDivsCreatedForTabs = [];
  }

  /**
   * Functions to get all the tabs with graphs (for this user), getting all the sensors as well as getting ready to draw graphs
   */
  ngOnInit(): void {
    this.httpService.getTabs().subscribe((response) => {
        let tabCounter = 1;

        for (let responseKey in response) {
          // @ts-ignore
          const rep = response[responseKey];

          let graphCounter = 0;
          for (const responseKeyKey in rep.graphsDTO) {
            const settings = rep.graphsDTO[graphCounter].settings;

            this.graphs.push(new Graph(rep.graphsDTO[graphCounter].name, rep.graphsDTO[graphCounter].type, rep.graphsDTO[graphCounter].tabId, settings));
            graphCounter++;
          }

          this.tabArray.push(new Tab(tabCounter, rep.name, this.graphs, tabCounter));

          this.graphs = [];
          this.tabIndices.push(tabCounter);

          tabCounter++;
        }
      },
      (error) => {
        throwError(error);
      });

    this.httpService.getSensorData().subscribe((response: any) => {
      this.sensorsDataList.push(response);
      this.createConnection();
      this.doSubscribe();
    });

    google.charts.load('current', {packages: ['corechart', 'gauge']});
  }

  /**
   * This function is used to draw the graphs on the page.
   */
  drawChart() {
    const mainOptions = {
      legend: 'none',
    }
    let button;

    GlobalComponent.sensor.forEach((sensor) => {
      const tabId = GlobalComponent.tabId;
      let options = {}

      if (GlobalComponent.tabArray[tabId].graphs.some((x) => x.name === sensor[0])) {
        let chart;

        switch (sensor[2]) {
          case "linechart":
            const sensorName = this['data_' + sensor[0]];
            this['data_' + sensor[0]] = new google.visualization.DataTable;
            this['data_' + sensor[0]].addColumn('string', 'val1');
            this['data_' + sensor[0]].addColumn('number', 'val2');


            for (let i = 0; i < sensor[1].length; i += 2) {
              this['data_' + sensor[0]].addRow(["0", Number(sensor[1][i + 1])]);
            }

            options = {
              title: sensor[0],
            }

            chart = new google.visualization.LineChart(document.getElementById(sensor[0] + Number(tabId + 1)));
            break;

          case "gauge":
            this['data_' + sensor[0]] = new google.visualization.arrayToDataTable([
              ['Label', 'Value'],
              [sensor[0], Number(sensor[1])]
            ]);

            const settings = sensor[3];
            const min = settings[0];
            const max = settings[1];
            const greenTo = settings[2];
            const yellowTo = settings[3];

            options = {
              min: min,
              max: max,
              greenFrom: min, greenTo: greenTo,
              yellowFrom: greenTo, yellowTo: yellowTo,
              redFrom: yellowTo, redTo: max,
            }

            chart = new google.visualization.Gauge(document.getElementById(sensor[0] + Number(tabId + 1)));
        }
        chart.draw(this['data_' + sensor[0]], {...mainOptions, ...options});
      }
    });
  }


  private curSubscription: Subscription | undefined;

  //The actual connection data is set inside the app.module.ts file
  connection: IMqttServiceOptions = {}

  client: MqttService | undefined;
  isConnection = false;
  subscribeSuccess = false;


  /**
   * This function creates a connection to the broker. The onMessage.subscribe listens to the broker for new data and stores it
   */
  createConnection() {
    try {
      this.client?.connect(this.connection as IMqttServiceOptions)
    } catch (error) {
      throwError(error);
    }

    this.client?.onConnect.subscribe(() => {
      this.client?.onMessage.subscribe((packet: any) => {
      });

      this.isConnection = true
    });
    this.client?.onError.subscribe((error: any) => {
      this.isConnection = false
      throwError(error)
    });

    this.client?.onMessage.subscribe((packet: any) => {
      if (this[packet.topic.toString()]) {
        if (this.tabArray[GlobalComponent.tabId].graphs.some((x) => x.name === packet.topic.toString().split("/").pop())) {
          this.tabArray[GlobalComponent.tabId].graphs.forEach(value => {
            const sensorValueAsArray = packet.payload.toString().split(":", 2);

            if (packet.topic.toString().split("/").pop() === value.name) {
              switch (value.type.toLocaleLowerCase()) {
                case ChartType.LineChart.toLocaleLowerCase():
                  this[packet.topic.toString()].push(sensorValueAsArray[0], sensorValueAsArray[1]);
                  break;

                case ChartType.Gauge.toLocaleLowerCase():
                  this[packet.topic.toString()][0] = sensorValueAsArray[1];
                  break;
              }
            }
          });

          if (this[packet.topic.toString()].length > 50) {
            this[packet.topic.toString()].splice(0, 2);
          }
        }
      }

      this.drawChart();
    })
  }

  /**
   * The doSubscribe function is the function that calls the subscribe on all needed topics
   */
  doSubscribe() {
    if (!this.subscribeSuccess) {
      this.curSubscription = this.client?.observe(("sensors/+"), {} as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
        this.subscribeSuccess = true
      })
    }
  }

  /**
   * Stops the connection to the broker
   */
  destroyConnection() {
    try {
      this.client?.disconnect(true)
      this.isConnection = false
      this.subscribeSuccess = false;
    } catch (error: any) {
      throwError(error);
    }
  }

  /**
   * Function that is called when a different tab is called.
   * @param $event gives the TabId from the clicked tab
   */
  onTabChanged($event: MatTabChangeEvent) {
    GlobalComponent.tabId = $event.index;
    this.createDivs();
  }

  /**
   * Called when a new tab is created and navigated to
   * @param index the new tab id that has been created
   */
  updateTabIndices(index: number) {
    this.createDivs();
  }

  /**
   * When a new graph is clicked for creation on the page this handles giving the graph the right settings (e.g. gauge from gaugeSettings (database table))
   * @param sensorName the name of the sensor the graph is being drawn for
   */
  addSettings(sensorName: string) {
    this.tabArray[GlobalComponent.tabId].graphs.forEach(value => {
      if (value.name === sensorName && value.settings.length !== 0) {
        GlobalComponent.sensor.forEach(sensors => {
          if (sensors[0] === sensorName) {
            sensors[3] = value.settings;
          }
        })
      }
    });
  }

  /**
   * This function creates a div for every graph that possibly needs to be drawn. This function also handles the settings for the graphs in the database.
   */
  createDivs() {
    let graphType = '';
    const datalist = this.sensorsDataList[0];
    let graphID = '';

    if (datalist === undefined) return;
    for (let j = 0; j < GlobalComponent.tabArray.length; j++) {
      if (GlobalComponent.tabArray[j].tabId === Number(GlobalComponent.tabId + 1)) {
        if (!this.sensorDivsCreatedForTabs.includes(GlobalComponent.tabArray[j].tabId)) {
          for (let i = 0; i < datalist.length; i++) {
            const sensorName = datalist[i].sensorName.toString();
            if (datalist[i].graphTypeDTOList[0] !== undefined) {
              graphType = datalist[i].graphTypeDTOList[0].graphType;

              switch (graphType) {
                case "linechart":
                  this['sensors/' + sensorName] = ["0", 0];
                  break;

                case "gauge":
                  this['sensors/' + sensorName] = [0];
                  break;
              }
            }
            let settings;

            this.tabArray[j].graphs.forEach(value => {
              if (value.name === sensorName) {
                if (value.settings.length !== 0) {
                  settings = value.settings;
                }
              }
            });

            GlobalComponent.sensor.push([sensorName, this['sensors/' + sensorName], graphType, settings]);

            const divContainer = document.getElementById("graphHolder" + Number(j + 1));
            let el;
            let graphAndCloseHolder;
            let button;

            if (divContainer !== null) {
              graphAndCloseHolder = document.createElement("div");
              graphAndCloseHolder.setAttribute('id', "graphAndCloseHolder");
              graphAndCloseHolder.style.minWidth = '33%';
              graphAndCloseHolder.style.minHeight = "22vh";

              button = document.createElement("button");
              button.classList.add("btn-close");
              button.classList.add("graphDeleteBtn");
              el = document.createElement("div");
              el.setAttribute('id', sensorName + Number(j + 1));
              el.style.float = 'left';

              button.addEventListener('click', function HandleEvent() {
                if (confirm("Are you sure you want to delete this graph?")) {
                  $.ajax({
                    url: "http://localhost:8080/regterschotracing/graphs/" + GlobalComponent.tabId + "?graphid=" + i + "&token=" + sessionStorage.getItem("JWT"),
                    type: "DELETE",
                    success: function () {
                      console.log("http://localhost:8080/regterschotracing/graphs/" + GlobalComponent.tabId + "?graphid=" + i + "&token=" + sessionStorage.getItem("JWT"));
                    }
                  })
                }
              });

              graphAndCloseHolder.append(button);
              graphAndCloseHolder.style.float = "left";
              graphAndCloseHolder.append(el);
              divContainer.append(graphAndCloseHolder);
            }
          }
        }
        this.sensorDivsCreatedForTabs.push(GlobalComponent.tabArray[j].tabId);
      }
    }
  }
}
