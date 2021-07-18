import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoTipoVencimientoModel } from 'src/app/model-layer/mantenimiento/tipo-vencimiento/mantenimiento-tipo-vencimiento.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoTipoVencimientoService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: MantenimientoTipoVencimientoModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoTipoVencimientoModel();
  }

  findById(codigoTipoVencimiento: number): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/tipoVencimientoTipoCliente/obtener`, {codigo: String(codigoTipoVencimiento)}, "get");
  }

  save(model: MantenimientoTipoVencimientoModel): Promise<MantenimientoTipoVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoVencimientoTipoCliente/registrar`, model, "post");
  }

  update(model: MantenimientoTipoVencimientoModel): Promise<MantenimientoTipoVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoVencimientoTipoCliente/editar`, model, "put", { codigo: model.codigoTipoVencimientoTipoCliente });
  }

  updateFieldEstado(model: MantenimientoTipoVencimientoModel): Promise<MantenimientoTipoVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoVencimientoTipoCliente/cambiarEstado`, model, "put", { codigoTipoVencimiento: model.codigoTipoVencimiento });
  }

  list(): Promise<Array<MantenimientoTipoVencimientoModel>> {
    return this.apiservice.consume(`${this.baseUrl}/tipoVencimientoTipoCliente/listar`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/tipoVencimientoTipoCliente/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  findAllTipoVencimiento(): Promise<MantenimientoTipoVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoVencimiento/listar`, {});
  }

  findAllTipoCliente(): Promise<MantenimientoTipoVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoCliente/listar`, {
      'filtroEstado': (this.filterObj.estado == null ? "1" : this.filterObj.estado),
      'pagina': '1',
      'registrosPagina': '100',
      'columnaOrdenar': '',
      'orden': ''
    });
  }
}
