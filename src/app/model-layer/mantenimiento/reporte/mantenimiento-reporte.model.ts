import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoReporteModel {
  declare id:string;
  declare codigo: string;
  declare usuario: string;
  declare descripcion: string;
  declare codigoReporteTipoCliente: string;
  declare codigoTipoCliente: string;
  declare codigoReporte: string;
  declare descripcionTipoCliente: string;
  declare descripcionReporte: string;
  declare modoVigencia: string;
  declare mesesInactividad: string;

  declare codigoColumna: string;
  declare descripcionReporteColumna: string;

  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  declare codigoDetail: String;
  declare codigoSubDetail: String;
  
  constructor(){
    this.id = "";
    this.codigo = "";
    this.usuario = "";
    this.descripcion = "";
    this.codigoReporteTipoCliente = "";
    this.codigoTipoCliente = "";
    this.codigoReporte = "";
    this.descripcionTipoCliente = "";
    this.descripcionReporte = "";
    this.modoVigencia = "";
    this.mesesInactividad = "";
    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
    this.codigoDetail = "";
    this.codigoSubDetail = "";

    this.codigoColumna = "";
    this.descripcionReporteColumna = "";

  }
}