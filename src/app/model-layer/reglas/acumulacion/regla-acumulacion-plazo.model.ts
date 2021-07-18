import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class ReglaAcumulacionPlazoModel {
    declare id: string;
    declare codigo: string;
    declare descripcion: string;
    declare tipo: string;
    declare plazoMaximo: string;
    declare plazoMinimo: string;
    declare plazoTotal: string;
    declare estado: string;
    declare usrCre: string;
    declare fecCre: string;
    declare usrMod: string;
    declare fecMod: string;

    constructor(){      
      this.id = "";
      this.codigo = "";
      this.descripcion = "";
      this.tipo = "";
      this.plazoMaximo = "";
      this.plazoMinimo = "";
      this.plazoTotal = "";
      this.estado = "";
      this.usrCre = "";
      this.fecCre = "";
      this.usrMod = "";
      this.fecMod = "";
    }
  }