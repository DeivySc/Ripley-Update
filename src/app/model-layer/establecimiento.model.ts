import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class EstablecimientoModel {
    declare codigo: string;
    declare descripcion: string;
    declare estado: number;

    constructor(){
      this.codigo = "";
      this.descripcion = "";
      this.estado = 0;
    }
  }