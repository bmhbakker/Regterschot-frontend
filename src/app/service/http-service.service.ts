import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

/**
 * Generates the required links to the other webpages for backend implementations.
 */
export class HttpService {
  private url = 'http://localhost:8080/regterschotracing/';

  constructor(private http: HttpClient,) {
  }

  private token = sessionStorage.getItem("JWT");

  getTabs() {
    return this.http.get(this.url + "tabs?token=" + this.token);
  }

  deleteTab(id: number) {
    return this.http.delete(this.url + "tabs/" + id + "?token=" + this.token + "&tabid=" + id).subscribe();
  }

  getRaces() {
    return this.http.get(this.url + "overview?token=" + this.token);
  }

  getSensorData() {
    return this.http.get(this.url + "sensors?token=" + this.token);
  }

  getSettings(sensor: String) {
    return this.http.get(this.url + "sensorSettings?token=" + this.token + "&sensor=" + sensor);
  }

  createTab(tabName: String, raceID: number) {
    return this.http.post(this.url + "tabs?token=" + this.token + "&tabName=" + tabName + "&raceID=" + raceID, "");
  }
}
