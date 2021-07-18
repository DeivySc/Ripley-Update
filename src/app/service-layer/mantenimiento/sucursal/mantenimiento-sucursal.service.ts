import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoSucursalModel } from 'src/app/model-layer/mantenimiento/sucursal/mantenimiento-sucursal.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoSucursalService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
  }

  findById(codigo: number): Promise<MantenimientoSucursalModel> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/obtener`, {codigo: String(codigo)}, "get");
  }

  save(model: MantenimientoSucursalModel): Promise<MantenimientoSucursalModel> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/registrar`, model, "post");
  }

  update(model: MantenimientoSucursalModel): Promise<MantenimientoSucursalModel> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/editar`, model, "put", { codigo: model.codigo });
  }

  list(): Promise<Array<MantenimientoSucursalModel>> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/listarActivos`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/listar`, {
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
