import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoValoradoSucursalModel {
  declare codigo: string;
  declare descripcion: string;
  declare estado: boolean;
  declare checked: boolean;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare usuarioActualiza: string;//usuarioActualiza
  declare fecMod: string;
  
  constructor(){
    this.codigo = "";
    this.descripcion = "";
    this.estado = null;
    this.checked = null;
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.usuarioActualiza = "";
    this.fecMod = "";
  }
}