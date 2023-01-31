import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {OverviewComponent} from "./overview/overview.component";
import {BrokerConnectionComponent} from "./brokerconnection/brokerconnection.component";
import {AuthGuard} from "./auth-guard";

const routes: Routes = [
  {path: 'home', component: BrokerConnectionComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'overview', component: OverviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
