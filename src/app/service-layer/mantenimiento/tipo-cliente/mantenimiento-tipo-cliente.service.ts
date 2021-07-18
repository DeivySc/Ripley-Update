import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoTipoClienteModel } from 'src/app/model-layer/mantenimiento/tipo-cliente/mantenimiento-tipo-cliente.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoTipoClienteService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: MantenimientoTipoClienteModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoTipoClienteModel();
  }

  findById(id: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/tipoCliente/obtener`, {codigo: String(id)}, "get");
  }

  save(model: MantenimientoTipoClienteModel): Promise<MantenimientoTipoClienteModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoCliente/registrar`, model, "post");
  }

  update(model: MantenimientoTipoClienteModel): Promise<MantenimientoTipoClienteModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoCliente/editar`, model, "put", { codigo: model.codigo });
  }

  delete(model: MantenimientoTipoClienteModel): Promise<MantenimientoTipoClienteModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoCliente/eliminar`, model, "put", { codigo: model.codigo });
  }

  list(): Promise<Array<MantenimientoTipoClienteModel>> {
    return this.apiservice.consume(`${this.baseUrl}/tipoCliente/listar`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/tipoCliente/listar`, {
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
}
