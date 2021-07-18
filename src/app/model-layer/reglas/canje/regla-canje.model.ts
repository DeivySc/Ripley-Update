import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class ReglaCanjeModel {
    declare id: string;
    declare codTarjeta: string;
    declare descTarjeta: string;
    declare inicioVigencia: string;
    declare finVigencia: string;
    declare valorPuntaje: string;
    declare valorSoles: string;
    declare unidad: string;
    declare codTipPuntaje: string;
    declare descTipPun: string;
    declare montoMinimo: string;
    declare vigencia: string;
    declare estado: string;
    declare total: string;
    declare usrCre: string;
    declare fecCre: string;
    declare usrMod: string;
    declare fecMod: string;

    constructor(){
      this.id = "";
      this.codTarjeta = "";
      this.descTarjeta = "";
      this.inicioVigencia = "";
      this.finVigencia = "";
      this.valorPuntaje = "";
      this.valorSoles = "";
      this.unidad = "";
      this.codTipPuntaje = "";
      this.descTipPun = "";
      this.montoMinimo = "";
      this.vigencia = "";
      this.estado = "";
      this.total = "";
      this.usrCre = "";
      this.fecCre = "";
      this.usrMod = "";
      this.fecMod = "";
    }
  }