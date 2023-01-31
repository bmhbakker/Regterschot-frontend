import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {RouterOutlet} from "@angular/router";
import {HomeComponent} from './home/home.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions} from "@angular/material/core";
import {MatTableModule} from "@angular/material/table";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NavbarComponent} from './navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {ResizeObserverDirective} from "./navbar/resize-observer.directive";
import {TabsComponent} from './tabs/tabs.component';
import {GoogleChartsModule} from 'angular-google-charts';
import {MatMenuModule} from "@angular/material/menu";
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {OverviewComponent} from './overview/overview.component';
import {ModalComponent} from "./modal/modal.component";
import {NavbartopComponent} from "./navbartop/navbartop.component";
import {BrokerConnectionComponent} from "./brokerconnection/brokerconnection.component";
import {IMqttServiceOptions, MqttModule} from "ngx-mqtt";

/**
 * This sets the correct data for the broker to connect to
 */
export const connection: IMqttServiceOptions = {
  hostname: '127.0.0.1',
  port: 9001,
  path: '/ws',
  protocol: 'ws',
  connectOnCreate: false,
}

const globalRippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 0,
    exitDuration: 0
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ResizeObserverDirective,
    TabsComponent,
    LoginComponent,
    OverviewComponent,
    NavbarComponent,
    ModalComponent,
    NavbartopComponent,
    BrokerConnectionComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    DragDropModule,
    MatToolbarModule,
    FormsModule,
    MatDividerModule,
    MatIconModule,
    GoogleChartsModule,
    MatMenuModule,
    HttpClientModule,
    MatInputModule,
    MqttModule.forRoot(connection),

  ],
  providers: [{provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig}],
  exports: [
    ResizeObserverDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
