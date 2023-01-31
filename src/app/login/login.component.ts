import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * LoginComponent handles all frontend logic for logging a user in.
 */
export class LoginComponent implements OnInit {
  ErrorMessage: String | undefined;
  loginModel  = this.formbuilder.group({
    username: '',
    password: ''
  });
  constructor(
    private http: HttpClient,
    private router: Router,
    private formbuilder: FormBuilder) {

  }


  ngOnInit(): void {
  }

  /**
   * Sends a POST request to the backend to verify the login data inserted into the form. Shows an error message if the login data is false. Routes the user to the 'watch' page if data is correct
   */
  sendLogindata(): void {
    let url = "http://localhost:8080/regterschotracing/login";
    this.http.post<{ username: String, password: String }>(url, this.loginModel.value)
      .subscribe({
        next: data => {

          // @ts-ignore
          sessionStorage.setItem('JWT', data.token);
          this.router.navigate(['home']);
        },
        error: error => {
          this.ErrorMessage = "Your username or password is incorrect!";
        }
      })
  }
}

export interface loginModel {
  username: String;
  password: String;
}
