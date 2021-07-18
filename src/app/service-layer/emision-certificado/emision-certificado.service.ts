import { HttpClient, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
//import { EmisionCertificadoCanjeModel } from 'src/app/model-layer/emision-certificado/emision-certificado-canje.model';
//import { EmisionCertificadoHistoricoModel } from 'src/app/model-layer/emision-certificado/emision-certificado-historico.model';
import { EmisionCertificadoModel } from 'src/app/model-layer/emision-certificado/emision-certificado.model';
import { EncryptObjects } from 'src/app/shared/util/encryptObjects';
import { ApiService } from 'src/app/utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class EmisionCertificadoService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: EmisionCertificadoModel;
  //filterCanjeObj: EmisionCertificadoCanjeModel;
  //filterHistoricoObj: EmisionCertificadoHistoricoModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient,
    private encryptObjects: EncryptObjects) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new EmisionCertificadoModel();
  }

  findById(id: number): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}`, {id: String(id)}, "get");
  }

  list(): Promise<Array<EmisionCertificadoModel>> {
    return this.apiservice.consume(`${this.baseUrl}`, {});
  }
  
  page(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/cliente`, {
      
      'tipoDocumento': (this.filterObj.tipoDocumento ? String(this.filterObj.tipoDocumento) : ''),
      'nroDocumento': this.encryptObjects.encriptarString((this.filterObj.numeroDocumento ? String(this.filterObj.numeroDocumento) : '')),
      'apellidoPaterno': (this.filterObj.apellidoPaterno ? String(this.filterObj.apellidoPaterno) : ''),
      'apellidoMaterno': (this.filterObj.apellidoMaterno ? String(this.filterObj.apellidoMaterno) : ''),
      'nombres': (this.filterObj.nombres ? String(this.filterObj.nombres) : '')
    }, "post");
  }
  
  all(): Promise<any> {
    return this.page();
  }
  

  fillSucursales(): Promise<Array<any>> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/listar`, {
      'filtroEstado': '1',
      'pagina': '1',
      'registrosPagina': '10000',
      'columnaOrdenar': '',
      'orden': ''
    });
  }

  fillEstablecimientos(): Promise<Array<any>> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado/establecimiento`, {}, "get");
  }

  fillValorado(model: any): Promise<Array<any>> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado/valorado`, {
      'codEstablecimiento': model.establecimiento,
      'filtroEstado': '1',
      'filtroCodigoValorado': '4',
      'pagina': '1',
      'registrosPagina': '10000',
      'columnaOrdenar': '',
      'orden': 'asc'
    }, "get");
  }

  findAllTipoTarjetaCliente(model:any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/tipotarjeta/cliente`, model, "get");
  }
  
  certificadoEmitir(model: any): Promise<Array<any>> {

    return this.apiservice.consume(`${this.baseUrl}/cuenta/certificado/emitir`, {
      'usuario': 'SRP',
      'observacion': model.observacion,
      'producto': model.valorado,
      'descProducto': model.descValorado,
      'sucursal': model.sucursal,
      'establecimiento': model.establecimiento,
      'tipoTarjeta': model.tipoTarjeta,
      'puntos': model.puntosDescuento
    }, "post", {'idCliente' : model.codigo});//451090
  }

  certificadoEmitirPDF(model: any): Promise<Array<any>> {

    return this.apiservice.consume(`${this.baseUrl}/cuenta/certificado/emitir/pdf`, {
      'nroDocumento': model.nroDocumento,
      'nroCuenta': model.nroCuenta,
      'puntos': model.puntos,
      'producto': model.valorado,
      'codigoCertificado': model.codigoCertificado,
      'valorCertificado': model.valorCertificado,
      'cliente': model.cliente,
      'descripcionSucursal': model.descripcionSucursal,
      'codigo': model.codigo,
    }, "post", {'idCliente' : model.codigo});//451090
  }

  

  findAllTipoPuntos(): Promise<Array<any>> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/puntos`, {}, "get");
  }
  
  findClient(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/cliente`, { idCliente: model.idCliente }, "get", { idCliente: model.idCliente });
  }

  findClientPuntos(model: any): Promise<any> {
    let modelEncriptado = this.encryptObjects.encriptarEstadoCuentas(model);
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/puntoscliente`, modelEncriptado, "post");
  }  

  findAllCuentasEstadoActuales(model:any): Promise<any> {
    model.nroDocumento = this.encryptObjects.encriptarString(model.nroDocumento);
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/actual`, model, "post");
  }

  findAllCuentasEstadoAnteriores(model:any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/anterior`, { idCliente: model.idCliente }, "get", { idCliente: model.idCliente });
  }

  findAllCuentasPuntosVencer(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/puntosporvencer`, { idCliente: model.idCliente }, "get", { idCliente: model.idCliente });
  }

  save(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/insertartransaccion`, model, "post", {idCliente: this.filterObj.codigo});
  }


}