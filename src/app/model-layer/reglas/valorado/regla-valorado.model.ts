import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class ReglaValoradoModel {
    declare id: string;
    declare rceId: string;
    declare codEstablecimiento: string;
    declare factor: string;
    declare puntajeMinimo: string;
    declare inicioVigencia: string;
    declare finVigencia: string;
    declare rceCodEstab: string;
    declare razonSocial: string;
    declare valorado: string;
    declare rceFactor: string;
    declare rcePuntajeMinimo: string;
    declare rceInicioVigencia: string;
    declare rceFinVigencia: string;
    declare rceEstado: string;
    declare vigencia: string;
    declare estado: string;
    declare checked: string;
    declare total: string;
    declare usrCre: string;
    declare fecCre: string;
    declare usrMod: string;
    declare fecMod: string;

    constructor(){
      this.id = "";
      this.rceId = "";
      this.codEstablecimiento = "";
      this.factor = "";
      this.puntajeMinimo = "";
      this.inicioVigencia = "";
      this.finVigencia = "";
      this.rceCodEstab = "";
      this.razonSocial = "";
      this.valorado = "";
      this.rceFactor = "";
      this.rcePuntajeMinimo = "";
      this.rceInicioVigencia = "";
      this.rceFinVigencia = "";
      this.rceEstado = "";
      this.vigencia = "";
      this.estado = "";
      this.checked = "";
      this.total = "";
      this.usrCre = "";
      this.fecCre = "";
      this.usrMod = "";
      this.fecMod = "";
    }
  }