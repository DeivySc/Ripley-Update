import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class CargaCampaniaModel {
  nombreArchivo: string;
  archivoBase64: string;
  codigoAjuste: string;
  usuario: string;
  extension: string;

  id: string;
  fechaCarga: string;
  fechaProceso: string;
  campania: string;
  cantidad: string;
  puntos: string;


  idCabecera: string;
  cuenta: string;

  cuentas: string;
  usuarioActualiza: string;

  codigo: string;
  descripcion: string;
  padre: string;
  comentario: string;
  tipoMovimiento: string;

  campana: string;
  buscarCodigo: string;
  listaSucursales: string;
  fechaVencimiento: string;
  
  constructor(){
    this.nombreArchivo = "";
    this.archivoBase64 = "";
    this.codigoAjuste = "";
    this.usuario = "";
    this.extension = "";  
    this.id = "";
    this.fechaCarga = "";
    this.fechaProceso = "";
    this.campania = "";
    this.cantidad = "";
    this.puntos = ""; 
    this.idCabecera = "";
    this.cuenta = ""; 
    this.cuentas = "";
    this.usuarioActualiza = "";  
    this.codigo = "";
    this.descripcion = "";
    this.padre = "";
    this.comentario = "";
    this.tipoMovimiento = "";  
    this.campana = "";
    this.buscarCodigo = "";
    this.listaSucursales = "";
    this.fechaVencimiento = "";
  }
}