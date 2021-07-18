import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})

export class MantenimientoSucursalComercioModel {
    declare codigoComercio: string;
    declare codigoSucursal: string;
    declare nombreSucursal: string;
    declare estado: string;
    declare usuarioRegistra: string;
    declare usuarioActualiza: string;
    declare codigo: string;//Validar sino eliminar
    declare usrCre: string;//Validar sino eliminar
    declare fecCre: string;//Validar sino eliminar
    declare usrMod: string;//Validar sino eliminar
    declare fecMod: string;//Validar sino eliminar
            
      
    constructor(){
        this.codigoComercio = "";
        this.codigoSucursal = "";
        this.nombreSucursal = "";
        this.estado = "";
        this.usuarioRegistra = "";
        this.usuarioActualiza = "";
        this.codigo = "";
        this.usrCre = "";
        this.fecCre = "";
        this.usrMod = "";
        this.fecMod = "";
    }
}