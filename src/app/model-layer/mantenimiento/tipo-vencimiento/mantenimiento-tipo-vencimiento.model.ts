import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoTipoVencimientoModel {
  declare id:string;
  declare codigo: string;
  declare usuario: string;
  declare descripcion: string;
  declare codigoTipoVencimientoTipoCliente: string;
  declare codigoTipoCliente: string;
  declare codigoTipoVencimiento: string;
  declare descripcionTipoCliente: string;
  declare descripcionTipoVencimiento: string;
  declare modoVigencia: string;
  declare mesesInactividad: string;
  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  
  constructor(){
    this.id = "";
    this.codigo = "";
    this.usuario = "";
    this.descripcion = "";
    this.codigoTipoVencimientoTipoCliente = "";
    this.codigoTipoCliente = "";
    this.codigoTipoVencimiento = "";
    this.descripcionTipoCliente = "";
    this.descripcionTipoVencimiento = "";
    this.modoVigencia = "";
    this.mesesInactividad = "";
    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
  }
}