import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoSucursalModel {
  declare codigo: string;
  declare descripcion: string;
  declare direccion: string;
  declare ruc: string;
  declare ciudad: string;
  declare distrito: string;
  declare nombre: string;
  declare sucursalEquivalencia: string;
  declare sucursalBase: string;
  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  
  constructor(){
    this.codigo = "";
    this.nombre = "";
    this.descripcion = "";
    this.direccion = "";
    this.ruc = "";
    this.ciudad = "";
    this.distrito = "";
    this.nombre = "";
    this.sucursalEquivalencia = "";
    this.sucursalBase = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
  }
}