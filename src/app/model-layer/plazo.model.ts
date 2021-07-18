import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class PlazoModel {
    declare id: string;
    declare codigo: string;
    declare codigo_padre: string;
    declare descripcion: string;
    declare estado: number;

    constructor(){
      this.id = "";
      this.codigo = "";
      this.codigo_padre = "";
      this.descripcion = "";
      this.estado = 0;
    }
  }