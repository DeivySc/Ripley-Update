import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class ReglaAcumulacionModel {
    declare id: string;
    declare nombre: string;
    declare tipo: string;
    declare inicioVigencia: string;
    declare finVigencia: string;
    declare puntaje: string;
    declare tipoPuntaje: string;
    declare unidadCompra: string;
    declare vigencia: string;
    declare tipregId: string;
    declare estado: string;
    declare usrCre: string;
    declare fecCre: string;
    declare usrMod: string;
    declare fecMod: string;

    constructor(){      
      this.id = "";
      this.nombre = "";
      this.tipo = "";
      this.inicioVigencia = "";
      this.finVigencia = "";
      this.puntaje = "";
      this.tipoPuntaje = "";
      this.unidadCompra = "";
      this.vigencia = "";
      this.tipregId = "";
      this.estado = "";
      this.usrCre = "";
      this.fecCre = "";
      this.usrMod = "";
      this.fecMod = "";
    }
  }