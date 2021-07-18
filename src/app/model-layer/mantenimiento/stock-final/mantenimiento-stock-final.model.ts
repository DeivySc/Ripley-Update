import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoStockFinalModel {
  declare id:string;

  declare anio: string;
  declare mes: string;
  declare valorSoles: string;
  declare unidades: string;
  declare tarjeta: string;
  declare listaTarjetas: string;

  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  
  constructor(){
    this.id = "";
    this.anio = "";
    this.valorSoles = "";
    this.unidades = "";
    this.tarjeta = "";
    this.listaTarjetas = "";
    
    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
  }
}