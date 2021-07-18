import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class EmisionCertificadoModel {
  declare codigo:string;
  declare idSubproducto: string;

  declare nroCuenta: string;
  
  declare tipoDocumento: string;
  declare descripcionDocumento: string;
  declare numeroDocumento: string;

  declare segmento: string;
  declare numeroTarjeta: string;
  declare apellidoPaterno: string;
  declare apellidoMaterno: string;
  declare nombres: string;
  declare fechaRegistro: string;
  declare horaRegistro: string;
  declare puntosCalificables: string;
  declare puntosFaltantesSiguienteSegmento: string;
  declare puntosDisponibles: string;
  declare puntosCanjeados: string;
  declare puntosInactivos: string;
  declare puntosAnulados: string;
  declare puntosSaldoAnterior: string;
  declare puntosGanadosAnterior: string;
  declare puntosCanjeadosAnterior: string;
  declare fechaVencimiento: string;
  declare puntosPorVencer: string;

  declare total: string;

  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  
  constructor(){
    this.codigo = "";
    this.idSubproducto = "";
    
    this.tipoDocumento = "";
    this.descripcionDocumento = "";
    this.numeroDocumento = "";

    this.segmento = "";
    this.numeroTarjeta = "";
    this.apellidoPaterno = "";
    this.apellidoMaterno = "";
    this.nombres = "";
    this.fechaRegistro = "";
    this.horaRegistro = "";
    this.puntosCalificables = "";
    this.puntosFaltantesSiguienteSegmento = "";
    this.puntosDisponibles = "";
    this.puntosCanjeados = "";
    this.puntosInactivos = "";
    this.puntosAnulados = "";
    this.puntosSaldoAnterior = "";
    this.puntosGanadosAnterior = "";
    this.puntosCanjeadosAnterior = "";
    this.fechaVencimiento = "";
    this.puntosPorVencer = "";

    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
  }
}