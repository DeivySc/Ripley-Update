import { Injectable } from "@angular/core";
import { MantenimientoTipoClienteModel } from "../../mantenimiento/tipo-cliente/mantenimiento-tipo-cliente.model";

@Injectable({
  providedIn: "root"
})

export class ReporteMovimientoMesModel {
  declare id:string;
  declare codigoTipoCliente: string;
  declare codigoMovimiento: string;
  declare secuencia: string;
  declare mesInicial: string;
  declare mesFinal: string;
  declare diaInicioVigencia: string;
  declare mesInicioVigencia: string;
  declare descripcionTipoCliente: string;
  declare descripcionMovimiento: string;
  declare periodo: string;
  declare descripcionPeriodotrimestral: string;
  declare codigoTipoClienteCrm: string;
  declare cantidadMeses: string;
  declare inicio: string;
  declare tipoClientes: MantenimientoTipoClienteModel;
  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  declare tipoTarjeta: string;
  declare mes: string;
  declare anio: string;
  
  constructor(){
    this.id = "";
    this.codigoTipoCliente = "";
    this.codigoMovimiento = "";
    this.secuencia = "";
    this.mesInicial = "";
    this.mesFinal = "";
    this.diaInicioVigencia = "";
    this.mesInicioVigencia = "";
    this.descripcionTipoCliente = "";
    this.descripcionMovimiento = "";
    this.periodo = "";
    this.descripcionPeriodotrimestral = "";
    this.codigoTipoClienteCrm = "";
    this.cantidadMeses = "";
    this.inicio = "";
    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
    this.tipoTarjeta = "";
    this.mes = "";
    this.anio = "";
  }
}