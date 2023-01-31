import {Component, Input} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Tab} from "../model/tab.model";
import {GlobalComponent} from "../global-component";
import {FormControl} from "@angular/forms";
import {RoundSelection} from "../roundSelection";
import {HttpService} from "../service/http-service.service";
import {BrokerConnectionComponent} from "../brokerconnection/brokerconnection.component";
import {HttpClient} from "@angular/common/http";

@Component({
  providers: [BrokerConnectionComponent],
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

/**
 * ModalComponent generates the Modal that is displayed when the user wants to create a new Tab.
 */
export class ModalComponent {
  closeResult = '';
  tabArray = GlobalComponent.tabArray;
  selected = new FormControl(0);
  areTextFieldsVisible = false;
  private url = 'http://localhost:8080/regterschotracing/';

  @Input() public roundFrom: any;
  @Input() public roundTo: any;

  selectedRounds: RoundSelection = {
    // @ts-ignore
    roundFrom: undefined,
    // @ts-ignore
    roundTo: undefined,

  }

  constructor(private modalService: NgbModal,
              private http: HttpService,
              private comp: BrokerConnectionComponent,
              private httpClient: HttpClient) {
  }

  /**
   * Method to open the modal in order to get the user to add a new tab.
   * @param content Content of the modal that should be shown. Should be in the html tag of the template.
   */
  open(content: any) {
    this.areTextFieldsVisible = false;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  /**
   * Logs the closing reason to the console for debugging purposes.
   * @param reason Dismiss reason for closing the modal.
   * @return String
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  addTab(selectAfterAdding: boolean, name: String) {
    const tabName = String(((name) ? name : "new"));

    if (this.roundFrom && this.roundTo) {
      this.tabArray.push(new Tab(this.tabArray.length + 1, tabName + ' from: ' + this.roundFrom + ' to: ' + this.roundTo, [], this.tabArray.length + 1));
    } else if (this.roundFrom && !this.roundTo) {
      this.tabArray.push(new Tab(this.tabArray.length + 1, tabName + ' from: ' + this.roundFrom, [], this.tabArray.length + 1));
    } else {
      this.tabArray.push(new Tab(this.tabArray.length + 1, tabName, [], this.tabArray.length + 1));
    }

    this.http.createTab(tabName, 1).subscribe();

    this.roundFrom = this.roundTo = '';
    this.comp.updateTabIndices(this.tabArray.length);
  }

  /**
   * Method to remove a tab from the view.
   */
  removeTab() {
    if (window.confirm('Are you sure you want to delete this tab?')) {
      this.http.deleteTab(GlobalComponent.tabId);
    }
  }

  /**
   * Checks whether there's at least one tab in the view.
   */
  hasAtLeastOneTab(): boolean {
    return this.tabArray.length > 0;
  }

  ngOnInit(): void {
  }
}
