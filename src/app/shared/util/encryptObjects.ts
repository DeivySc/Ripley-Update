import { Injectable } from '@angular/core';
import { SrpEncryption } from '../../shared/util/srpEncyption';

@Injectable({
    providedIn: 'root'
  })
export class EncryptObjects{

    constructor(private srpEncryption: SrpEncryption) { }

    encriptarEstadoCuentas(model: any): any {
        if (model.nroDocumento != undefined) {model.nroDocumento = this.srpEncryption.encryptText(model.nroDocumento)};
        if (model.nombres != undefined) {model.nombres = this.srpEncryption.encryptText(model.nombres)};
        if (model.apellidoPaterno != undefined) {model.apellidoPaterno = this.srpEncryption.encryptText(model.apellidoPaterno)};
        if (model.apellidoMaterno != undefined) {model.apellidoMaterno = this.srpEncryption.encryptText(model.apellidoMaterno)};
        if (model.nroCuenta != undefined) {model.nroCuenta = this.srpEncryption.encryptText(model.nroCuenta)};
        return model;
    }
    encriptarEmisionCertificado(model: any): any {
        if (model.nroDocumento != undefined) {model.nroDocumento = this.srpEncryption.encryptText(model.nroDocumento)};
        if (model.nombres != undefined) {model.nombres = this.srpEncryption.encryptText(model.nombres)};
        if (model.apellidoPaterno != undefined) {model.apellidoPaterno = this.srpEncryption.encryptText(model.apellidoPaterno)};
        if (model.apellidoMaterno != undefined) {model.apellidoMaterno = this.srpEncryption.encryptText(model.apellidoMaterno)};
        if (model.nroCuenta != undefined) {model.nroCuenta = this.srpEncryption.encryptText(model.nroCuenta)};
        return model;
      }
    encriptarString(model: string): string {
        model = this.srpEncryption.encryptText(model);
 
        return model;
      }
}