import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  isLogin = false;
  constructor(
    private authService: AuthService,
    // private tokenStorage: TokenStorageService,
    private router: Router,
    ) { }

  ngOnInit() {
    // if (this.tokenStorage.getToken()) {
    //   this.isLoggedIn = true;
    //   this.roles = this.tokenStorage.getUser().roles;
    // }
    console.log("localStorage-getLogin:",localStorage.getItem("login"));


     if (localStorage.getItem("login")) {
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.router.navigateByUrl('/Reglas/Acumulacion/Bandeja');
    }

  }

  onSubmit() {
    console.log("this.form:", this.form);
    console.log("login local:",localStorage.getItem("login"));

    if (this.form.username != null && this.form.password) {
      this.isLogin = true;
      localStorage.setItem("login", JSON.stringify(this.isLogin));
      this.authService.setToken(this.isLogin);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.router.navigateByUrl('/Reglas/Acumulacion/Bandeja');
    }



    else {
      this.isLoginFailed = true;
    }

    // this.authService.login(this.form).subscribe(
    //   data => {
    //     this.tokenStorage.saveToken(data.accessToken);
    //     this.tokenStorage.saveUser(data);

    //     this.isLoginFailed = false;
    //     this.isLoggedIn = true;
    //     this.roles = this.tokenStorage.getUser().roles;
    //     this.reloadPage();
    //   },
    //   err => {
    //     this.errorMessage = err.error.message;
    //     this.isLoginFailed = true;
    //   }
    // );
  }

  reloadPage() {
    window.location.reload();
  }
}


