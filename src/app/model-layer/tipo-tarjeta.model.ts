import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class TipoTarjetaModel {
    declare id: string;
    declare descripcion: string;
    declare cod_tipo: string;
    declare estado: number;

    constructor(){
      this.id = "";
      this.descripcion = "";
      this.cod_tipo = "";
      this.estado = 0;
    }
  }