import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoTipoClienteModel {
  declare codigo: string;
  declare usuario: string;
  declare descripcion: string;
  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  
  constructor(){
    this.codigo = "";
    this.usuario = "";
    this.descripcion = "";
    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
  }
}