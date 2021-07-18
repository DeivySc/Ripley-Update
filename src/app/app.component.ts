import { Component, OnInit } from '@angular/core';
import { HeaderService } from './services/header.service';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isExist: boolean = false;
  title: string = "";
  mode = new FormControl('over');
  show: any = false;
  keyId: number = 0;
  showColor: boolean = false;
  ruta:any;

  constructor(
    private _header: HeaderService,
    private router: Router,
    public _authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.getTitle();
    this.router.events.pipe( filter(event => event instanceof NavigationEnd)).subscribe((routes) => {
      this.ruta = routes;
    });
  }

  logout() {
    this._authService.logout();
  }

  getTitle() {
    this._header.currentMessage.subscribe(
      (data: any) => {
        if (data) {
          setTimeout(() => {
            this.isExist = true;
            this.title = data.title;
          });
        }
      },
      (err) => { }
    )

  }

  showMenu(id: number) {
    this.keyId = id;
    this.showColor = true;
  }


}
