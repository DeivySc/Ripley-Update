import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:8081/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = new Subject();
  currentToken = this.token.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }


  isLogin() {
    let token = localStorage.getItem("login");
    return token != null;
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  setToken(item: any) {
    this.token.next(item)
  }
}
