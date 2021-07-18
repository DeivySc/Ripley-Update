import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoParametroModel {
  declare id:string;
  declare codigo: string;
  declare descripcion: string;
  declare padre: string;
  declare comentario: string;
  declare tipoMovimiento: string;
  declare descripcionTipoMovimiento: string;
  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  
  declare filtroTabla: string;
  declare filtroParametro: string;
  declare filtroSucursal: string;
  declare filtroEstablecimiento: string;
  declare filtroValorado: string;
  declare filtroUsuario: string;
  declare filtroTipoTarjetaCliente: string;
  declare filtroTipoCliente: string;
  declare filtroValoradoReglaVigente: string;
  declare filtroValoradoSinReglaVigente: string;
  declare filtroEstablecimientoReglaVigente: string;
  declare filtroSucursalReglaVigente: string;
  declare filtroTipoMovimientoSinAsignar: string;
  
  declare columnaNombre: string;
  declare columnaOrden: string;
  
  constructor(){
    this.id = "";
    this.codigo = "";
    this.descripcion = "";
    this.padre = "";
    this.comentario = "";
    this.tipoMovimiento = "";
    this.descripcionTipoMovimiento = "";
    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";

    this.filtroTabla = "";
    this.filtroParametro = "";
    this.filtroSucursal = "";
    this.filtroEstablecimiento = "";
    this.filtroValorado = "";
    this.filtroUsuario = "";
    this.filtroTipoTarjetaCliente = "";
    this.filtroTipoCliente = "";
    this.filtroValoradoReglaVigente = "";
    this.filtroValoradoSinReglaVigente = "";
    this.filtroEstablecimientoReglaVigente = "";
    this.filtroSucursalReglaVigente = "";
    this.filtroTipoMovimientoSinAsignar = "";
    
    this.columnaNombre = "";
    this.columnaOrden = "";

    this.columnaNombre = "";
    this.columnaOrden = "";
  }
}