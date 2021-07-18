import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';
import { HeaderService } from '../services/header.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { menuOpciones } from './menuOpciones';


@Component({
  selector: 'app-menu-inicio',
  templateUrl: './menu-inicio.component.html',
  styleUrls: ['./menu-inicio.component.css']
})
export class MenuInicioComponent implements OnInit {
  isExist: boolean = false;
  title: string = "";
  mode = new FormControl('over');
  model: any[];

  events: string[] = [];
  opened: boolean;

  //revisar luego
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  showFiller = false;
  mostrarDatos = false;
  mostrarDatos2 = false;
  mostrarDatos3 = false;
  mostrarDatos4 = false;
  mostrarDatos5 = false;


  listOptions: any = [];
  keyId: number = 0;

  constructor(
    private userService: UserService,
    private tokenStorageService: TokenStorageService,
    private _header: HeaderService,
    private router: Router,
  ) {

    this.getTitle();
  }

  ngOnInit() {

    menuOpciones.forEach((e) => {
      const objTemp = {};
      Object.assign(objTemp, e);
      // this.model.push(objTemp);
      this.listOptions.push(objTemp);
    })
    console.log("this.listOptions:", this.listOptions);


    // this.isLoggedIn = !!this.tokenStorageService.getToken();

    // if (this.isLoggedIn) {
    //   const user = this.tokenStorageService.getUser();
    //   this.roles = user.roles;

    //   this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    //   this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

    //   this.username = user.username;
    // }
    // this.showAdminBoard = true;


  }

  logout() {
    // this.tokenStorageService.signOut();
    localStorage.clear();
    // this.router.navigateByUrl('/login');
    window.location.href = "/";
    window.location.reload();
  }

  getTitle() {
    this._header.currentMessage.subscribe(
      (data: any) => {
        if (data) {
          this.isExist = true;
          this.title = data.title;
        }
      },
      (err) => { console.log("error:", err); }
    )

  }



  activarMenu1(): void {
    this.mostrarDatos5 = false;
    this.mostrarDatos4 = false;
    this.mostrarDatos = true;
    this.mostrarDatos2 = false;
    this.mostrarDatos3 = false;
  }

  activarMenu2(): void {
    this.mostrarDatos5 = false;
    this.mostrarDatos4 = false;
    this.mostrarDatos2 = true;
    this.mostrarDatos3 = false;
    this.mostrarDatos = false;
  }

  activarMenu3(): void {
    this.mostrarDatos5 = false;
    this.mostrarDatos4 = false;
    this.mostrarDatos3 = false;
    this.mostrarDatos2 = false;
    this.mostrarDatos = false;
  }

  activarMenu4(): void {
    this.mostrarDatos5 = false;
    this.mostrarDatos4 = false;
    this.mostrarDatos3 = false;
    this.mostrarDatos2 = false;
    this.mostrarDatos = false;
  }

  activarMenu5(): void {
    this.mostrarDatos5 = true;
    this.mostrarDatos4 = false;
    this.mostrarDatos3 = false;
    this.mostrarDatos2 = false;
    this.mostrarDatos = false;
  }

  activarMenu6(): void {
    this.mostrarDatos5 = false;
    this.mostrarDatos4 = false;
    this.mostrarDatos3 = true;
    this.mostrarDatos2 = false;
    this.mostrarDatos = false;
  }

  activarMenu7(): void {
    this.mostrarDatos5 = false;
    this.mostrarDatos4 = true;
    this.mostrarDatos3 = false;
    this.mostrarDatos2 = false;
    this.mostrarDatos = false;
  }

  // showMenu(id: number) {
  //   console.log("id:", id);
  //   this.keyId = id;
  // }

}
