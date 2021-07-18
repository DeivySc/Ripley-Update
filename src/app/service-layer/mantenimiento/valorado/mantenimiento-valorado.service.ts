import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoValoradoSucursalModel } from 'src/app/model-layer/mantenimiento/valorado/mantenimiento-valorado-sucursal.model';
import { MantenimientoValoradoModel } from 'src/app/model-layer/mantenimiento/valorado/mantenimiento-valorado.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoValoradoService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: MantenimientoValoradoModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoValoradoModel();
  }

  findById(id: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/valorado/obtener`, {codigo: String(id)}, "get");
  }

  save(model: MantenimientoValoradoModel): Promise<MantenimientoValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/valorado/registrar`, model, "post");
  }

  update(model: MantenimientoValoradoModel): Promise<MantenimientoValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/valorado/editar`, model, "put", { codigo: model.codigo });
  }

  updateFieldEstado(model: MantenimientoValoradoModel): Promise<MantenimientoValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/valorado/cambiarEstado`, model, "put", { codigo: model.codigo });
  }

  list(): Promise<Array<MantenimientoValoradoModel>> {
    return this.apiservice.consume(`${this.baseUrl}/valorado/listar`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/valorado/listar`, {
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

  allSucursal(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/valoradoSucursal/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroCodigoValorado': this.filterObj.codigoValorado,
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  pageSucursalPorAsignar(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/listarXAsignarValorado`, {
      'codigoValorado': this.filterObj.codigoValorado,
      'filtroCodigoSucursal': "",
      'filtroEstado': "1",
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  allSucursalPorAsignar(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/listarXAsignarValorado`, {
      'codigoValorado': this.filterObj.codigoValorado,
      'filtroCodigoSucursal': "",
      'filtroEstado': "1",
      'pagina': "0",
      'registrosPagina': "0"
    });
  }

  saveSucursal(model: MantenimientoValoradoSucursalModel): Promise<MantenimientoValoradoSucursalModel> {
    return this.apiservice.consume(`${this.baseUrl}/valoradoSucursal/registrar`, model, "post");
  }

  updateFieldSucursalEstado(model: MantenimientoValoradoSucursalModel): Promise<MantenimientoValoradoSucursalModel>{
    return this.apiservice.consume(`${this.baseUrl}/valoradoSucursal/cambiarEstado`, model, "put", { codigo: model.codigo });
  }

}
