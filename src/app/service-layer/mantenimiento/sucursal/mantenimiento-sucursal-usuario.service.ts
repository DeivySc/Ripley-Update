import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MantenimientoSucursalUsuarioModel } from 'src/app/model-layer/mantenimiento/sucursal/mantenimiento-sucursal-usuario.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoSucursalUsuarioService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;
  
  isEditing: boolean;
  sharedData: string;

  filterObj: MantenimientoSucursalUsuarioModel;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoSucursalUsuarioModel();
  }

  searchUser(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/sucursalUsuario/listarXAsignarUsuario`, {
      'filtroUsuario': this.filterObj.nombre,
      'filtroSucursal': this.filterObj.codigoSucursal
    });
  }

  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/sucursalUsuario/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroSucursal': this.filterObj.codigoSucursal,
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  save(model: MantenimientoSucursalUsuarioModel): Promise<MantenimientoSucursalUsuarioModel> {
    return this.apiservice.consume(`${this.baseUrl}/sucursalUsuario/registrar`, model, "post");
  }

  updateFieldEstado(model: MantenimientoSucursalUsuarioModel): Promise<MantenimientoSucursalUsuarioModel> {
    return this.apiservice.consume(`${this.baseUrl}/sucursalUsuario/cambiarEstado`, model, "put", { codigo: model.codigo });
  }
}
