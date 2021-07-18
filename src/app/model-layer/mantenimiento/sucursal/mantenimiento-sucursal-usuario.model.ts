import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})

export class MantenimientoSucursalUsuarioModel {
    declare idSucursalUsuario: string;
    declare codigoSucursal: string;
    declare nombre: string;
    declare estado: string;
    declare listaUsuarios: string;
    declare usuarioRegistra: string;
    declare usuarioActualiza: string;
    declare codigo: string;//Validar sino eliminar
    declare usrCre: string;//Validar sino eliminar
    declare fecCre: string;//Validar sino eliminar
    declare usrMod: string;//Validar sino eliminar
    declare fecMod: string;//Validar sino eliminar

    constructor(){
        this.idSucursalUsuario = "";
        this.codigoSucursal = "";
        this.nombre = "";
        this.estado = "";
        this.listaUsuarios = "";
        this.usuarioRegistra = "";
        this.usuarioActualiza = "";
        this.codigo = "";
        this.usrCre = "";
        this.fecCre = "";
        this.usrMod = "";
        this.fecMod = "";
    }
}