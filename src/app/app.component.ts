import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'RegterschotDashboard';
  constructor(private router: Router) {}
  isLoginpage() {
    return this.router.url === '/login';
  }
}

