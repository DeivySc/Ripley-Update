import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

import { MantenimientoSucursalComercioModel } from 'src/app/model-layer/mantenimiento/sucursal/mantenimiento-sucursal-comercio.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoSucursalComercioService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;
  
  isEditing: boolean;
  sharedData: string;

  filterObj: MantenimientoSucursalComercioModel;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoSucursalComercioModel();
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<MantenimientoSucursalComercioModel> {
    return this.page(page, size, nameColumn, sort, "");
  }

  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<MantenimientoSucursalComercioModel> {
    return this.apiservice.consume(`${this.baseUrl}/comercio/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroSucursal': this.filterObj.codigoSucursal,
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  save(model: MantenimientoSucursalComercioModel): Promise<MantenimientoSucursalComercioModel> {
    return this.apiservice.consume(`${this.baseUrl}/comercio/registrar`, model, "post");
  }

  updateFieldEstado(model: MantenimientoSucursalComercioModel): Promise<MantenimientoSucursalComercioModel> {
    return this.apiservice.consume(`${this.baseUrl}/comercio/cambiarEstado`, model, "put", { codigoComercio: model.codigoComercio });
  }

}
