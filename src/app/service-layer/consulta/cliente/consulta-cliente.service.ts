import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { ConsultaClienteCanjeModel } from 'src/app/model-layer/consulta/cliente/consulta-cliente-canje.model';
import { ConsultaClienteHistoricoModel } from 'src/app/model-layer/consulta/cliente/consulta-cliente-historico.model';
import { ConsultaClienteModel } from 'src/app/model-layer/consulta/cliente/consulta-cliente.model';
import { EncryptObjects } from 'src/app/shared/util/encryptObjects';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaClienteService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: ConsultaClienteModel;
  filterCanjeObj: ConsultaClienteCanjeModel;
  filterHistoricoObj: ConsultaClienteHistoricoModel;
  
  isEditing: boolean;
  sharedData: string;
  
  constructor(
    _http: HttpClient,
    private encryptObjects: EncryptObjects) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new ConsultaClienteModel();
  }

  findById(idCliente: number): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/obtener/estadoCuentaCliente`, {idCliente: String(idCliente)}, "get");
  }

  list(): Promise<Array<ConsultaClienteModel>> {
    return this.apiservice.consume(`${this.baseUrl}`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/consulta/cliente`, {
      'estado': (state == null ? "1" : state),
      'tipoDocumento': (this.filterObj.tipoDocumento ? String(this.filterObj.tipoDocumento) : ''),
      'numeroDocumento': (this.filterObj.numeroDocumento ? this.encryptObjects.encriptarString((this.filterObj.numeroDocumento ? String(this.filterObj.numeroDocumento) : '')) : ''),
      'apellidoPaterno': (this.filterObj.apellidoPaterno ? String(this.filterObj.apellidoPaterno) : ''),
      'apellidoMaterno': (this.filterObj.apellidoMaterno ? String(this.filterObj.apellidoMaterno) : ''),
      'nombres': (this.filterObj.nombres ? String(this.filterObj.nombres) : '')
    }, "post", {
      'pagina': String(page),
      'registrosPagina': String(size)
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
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
     
  findAllCanjes(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    let model = {
      "idCliente": this.filterCanjeObj.idCliente,
      "fechaInicio": this.filterCanjeObj.fechaInicio,
      "fechaFin": this.filterCanjeObj.fechaFin,
      "tipoMovimiento": this.filterCanjeObj.tipoMovimiento,
      "pagina": String(page),
      "registrosPagina": String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    }
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/canjesrealizados`, model, "get", model);
  }

  findAllHistorico(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    let model = {
      "idCliente": this.filterCanjeObj.idCliente,
      "fechaInicio": this.filterCanjeObj.fechaInicio,
      "fechaFin": this.filterCanjeObj.fechaFin,
      "tipoMovimiento": this.filterCanjeObj.tipoMovimiento,
      "pagina": String(page),
      "registrosPagina": String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    }
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/movimientoshistoricos`, model, "get", model);
  }
     
  findAllCanjesList(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    let model = {
      "idCliente": this.filterCanjeObj.idCliente,
      "fechaInicio": this.filterCanjeObj.fechaInicio,
      "fechaFin": this.filterCanjeObj.fechaFin,
      "tipoMovimiento": this.filterCanjeObj.tipoMovimiento,
      "pagina": "1",
      "registrosPagina": "70000",
      'columnaOrdenar': "codigo",
      'orden': "desc"
    }
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/canjesrealizados`, model, "get", model);
  }

  findAllHistoricoList(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    let model = {
      "idCliente": this.filterCanjeObj.idCliente,
      "fechaInicio": this.filterCanjeObj.fechaInicio,
      "fechaFin": this.filterCanjeObj.fechaFin,
      "tipoMovimiento": this.filterCanjeObj.tipoMovimiento,
      "pagina": "1",
      "registrosPagina": "70000",
      'columnaOrdenar': "codigo",
      'orden': "desc"
    }
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/movimientoshistoricos`, model, "get", model);
  }

  save(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/insertartransaccion`, model, "post", {idCliente: this.filterObj.codigo});
  }

  obtenerDatosCertificado(): Promise<any> {
    let model = {
      "idCanje": this.filterCanjeObj.row.codigo
    }
    return this.apiservice.consume(`${this.baseUrl}/cuenta/certificado/canje`, model, "post", {idCliente: this.filterObj.codigo});
    
  }

  certificadoEmitirPDF(): Promise<any> {
    let model = {
      "idCliente": this.filterCanjeObj.certificado.idCliente,
      "nroDocumento": this.filterCanjeObj.certificado.numeroDocumento,
      "nroCuenta": this.filterCanjeObj.certificado.numeroCuenta,
      "producto": this.filterCanjeObj.certificado.descProducto,
      "codigoCertificado": this.filterCanjeObj.certificado.id,
      "valorCertificado": this.filterCanjeObj.certificado.valorCertificado,
      "cliente": this.filterCanjeObj.certificado.cliente,
      "descripcionSucursal": this.filterCanjeObj.certificado.descSucursal,
      'puntos': this.filterCanjeObj.certificado.puntos,
      
    }
    
    return this.apiservice.consume(`${this.baseUrl}/cuenta/certificado/canje/pdf`, model, "post", {idCliente: this.filterObj.codigo});
  }
  

/*
  reportesHistoricosExcel(idCliente: number, desdeDate: string, hastaDate: string, tipoMovimiento: string) {
    let params = new HttpParams();
    params = params.append('idCliente', String(idCliente));
    params = params.append('desde', desdeDate);
    params = params.append('hasta', hastaDate);
    params = params.append('tipoMovimiento', tipoMovimiento);
    return this.http.get(`${this.baseUrl}/cuenta/puntocuenta/movimientoshistoricos/descargarMovimientos`, { params}).pipe(
      map((data: any) => data),
      catchError(err => throwError(err))
    );
  }

  reportesCanjesHaberExcel(tipoDocumento: string, numeroDocumento: string, desdeDate: string, hastaDate: string, tipoMovimiento: string) {
    let model = {
      "tipoDocumento" :tipoDocumento ,
      "nroDocumento" : this.encryptObjects.encriptarString(numeroDocumento),
      "desdeDate" : desdeDate,
      "hastaDate" : hastaDate,
      "tipoMovimiento" : tipoMovimiento
    }
    return this.http.post<any>(`${this.baseUrl}/cuenta/puntocuenta/canjesrealizados/descargarCanjesHaber`, model);
  }

  reportesCanjesDeberExcel(tipoDocumento: string, numeroDocumento: string, desdeDate: string, hastaDate: string, tipoMovimiento: string) {
    let model = {
      "tipoDocumento" :tipoDocumento ,
      "nroDocumento" : this.encryptObjects.encriptarString(numeroDocumento),
      "desdeDate" : desdeDate,
      "hastaDate" : hastaDate,
      "tipoMovimiento" : tipoMovimiento
    }
    return this.http.post<any>(`${this.baseUrl}/cuenta/puntocuenta/canjesrealizados/descargarCanjesDeber`, model);
  }*/
}