import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class MantenimientoEmailProcesoModel {
  declare id:string;
  declare usuario: string;
  declare nombreUsuario: string;
  declare codigoProceso: string;
  declare nombreProceso: string;
  declare tipoEnvio: string;
  declare email: string;
  declare estado: string;
  declare usrCre: string;//usuarioRegistra
  declare fecCre: string;
  declare usrMod: string;//usuarioActualiza
  declare fecMod: string;
  
  constructor(){
    this.id = "";
    this.usuario = "";
    this.nombreUsuario = "";
    this.codigoProceso = "";
    this.nombreProceso = "";
    this.tipoEnvio = "";
    this.email = "";
    this.estado = "";
    this.usrCre = "";
    this.fecCre = "";
    this.usrMod = "";
    this.fecMod = "";
  }
}