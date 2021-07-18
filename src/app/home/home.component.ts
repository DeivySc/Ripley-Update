import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = "";
  constructor(
    private _header: HeaderService,
  ) { }

  ngOnInit(): void {
    console.log("estoy en on init de home component");

    this._header.settingValues({ title: this.title });

    // this._emisionCertificadoService.findAllDocumentType().subscribe((
    //   data=> {
    //     console.log("data tipo de documento:",data);

    //   }
    // ))
  }

}
