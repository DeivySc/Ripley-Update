import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoParametroModel } from 'src/app/model-layer/mantenimiento/parametro/mantenimiento-parametro.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoParametroService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: MantenimientoParametroModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoParametroModel();
  }

  findById(id: number): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/obtener`, {id: String(id)}, "get");
  }

  save(model: MantenimientoParametroModel): Promise<MantenimientoParametroModel> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/registrar`, model, "post");
  }

  update(model: MantenimientoParametroModel): Promise<MantenimientoParametroModel> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/editar`, model, "put", { id: model.id });
  }

  updateFieldEstado(model: MantenimientoParametroModel): Promise<MantenimientoParametroModel> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/cambiarEstado`, model, "put", { id: model.id });
  }

  list(): Promise<Array<MantenimientoParametroModel>> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listar`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroPadre': (this.filterObj.codigo ? String(this.filterObj.codigo) : '7000'),
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  findAllGroups(): Promise<MantenimientoParametroModel> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listarGrupo`, {      
    });
  }
  
  filterParent(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listar`, {
      'filtroEstado': (this.filterObj.estado == null ? "1" : this.filterObj.estado),
      'filtroPadre': (this.filterObj.padre ? String(this.filterObj.padre) : '7000'),
      'pagina': "1",
      'registrosPagina': "1000000",
      'columnaOrdenar': "",
      'orden': ""
    });
  }
  
  filterMasiva(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listar/masiva`, {
      'filtroTabla': (this.filterObj.filtroTabla ? String(this.filterObj.filtroTabla) : ''),
      'filtroParametro': (this.filterObj.filtroParametro ? String(this.filterObj.filtroParametro) : ''),
      'filtroSucursal': (this.filterObj.filtroSucursal ? String(this.filterObj.filtroSucursal) : ''),
      'filtroEstablecimiento': (this.filterObj.filtroEstablecimiento ? String(this.filterObj.filtroEstablecimiento) : ''),
      'filtroValorado': (this.filterObj.filtroValorado ? String(this.filterObj.filtroValorado) : ''),
      'filtroUsuario': (this.filterObj.filtroUsuario ? String(this.filterObj.filtroUsuario) : ''),
      'filtroTipoTarjetaCliente': (this.filterObj.filtroTipoTarjetaCliente ? String(this.filterObj.filtroTipoTarjetaCliente) : ''),
      'filtroTipoCliente': (this.filterObj.filtroTipoCliente ? String(this.filterObj.filtroTipoCliente) : ''),
      'filtroValoradoReglaVigente': (this.filterObj.filtroValoradoReglaVigente ? String(this.filterObj.filtroValoradoReglaVigente) : ''),
      'filtroValoradoSinReglaVigente': (this.filterObj.filtroValoradoSinReglaVigente ? String(this.filterObj.filtroValoradoSinReglaVigente) : ''),
      'filtroEstablecimientoReglaVigente': (this.filterObj.filtroEstablecimientoReglaVigente ? String(this.filterObj.filtroEstablecimientoReglaVigente) : ''),
      'filtroSucursalReglaVigente': (this.filterObj.filtroSucursalReglaVigente ? String(this.filterObj.filtroSucursalReglaVigente) : ''),
      'filtroTipoMovimientoSinAsignar': (this.filterObj.filtroTipoMovimientoSinAsignar ? String(this.filterObj.filtroTipoMovimientoSinAsignar) : ''),
      'columnaOrdenar': (this.filterObj.columnaNombre ? String(this.filterObj.columnaNombre) : ''),
      'columnaOrden': (this.filterObj.columnaOrden ? String(this.filterObj.columnaOrden) : '')
    });
  }
}
