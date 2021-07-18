import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoValoradoModel {
  declare codigoValorado:string;
  declare codigo: string;
  declare usuario: string;
  declare codigoEstablecimiento: string;
  declare descripcion: string;
  declare descripcionValorado: string;
  declare ruc: string;
  declare rucEstablecimiento: string;
  declare razonSocial: string;
  declare razonSocialEstablecimiento: string;
  declare sucursal: string;
  declare listaSucursales: string;
  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  
  constructor(){
    this.codigoValorado = "";
    this.codigo = "";
    this.usuario = "";
    this.codigoEstablecimiento = "";
    this.descripcion = "";
    this.descripcionValorado = "";
    this.ruc = "";
    this.rucEstablecimiento = "";
    this.razonSocial = "";
    this.razonSocialEstablecimiento = "";
    this.sucursal = "";
    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
  }
}