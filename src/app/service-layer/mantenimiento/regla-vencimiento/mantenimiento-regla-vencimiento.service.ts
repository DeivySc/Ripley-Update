import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoReglaVencimientoModel } from 'src/app/model-layer/mantenimiento/regla-vencimiento/mantenimiento-regla-vencimiento.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoReglaVencimientoService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: MantenimientoReglaVencimientoModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoReglaVencimientoModel();
  }

  findById(id: number): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reglaVencimiento/obtener`, {
      codigoTipoCliente: this.filterObj.codigoTipoCliente, 
      codigoMovimiento: this.filterObj.codigoMovimiento
    }, "get");
  }

  save(model: MantenimientoReglaVencimientoModel): Promise<MantenimientoReglaVencimientoModel> {
    console.log(model);
    return this.apiservice.consume(`${this.baseUrl}/reglaVencimiento/registrar`, model, "post");
  }

  update(model: MantenimientoReglaVencimientoModel): Promise<MantenimientoReglaVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/reglaVencimiento/editar`, model, "put");
  }

  updateFieldEstado(model: MantenimientoReglaVencimientoModel): Promise<MantenimientoReglaVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/reglaVencimiento/cambiarEstado`, model, "put");
  }

  list(): Promise<Array<MantenimientoReglaVencimientoModel>> {
    return this.apiservice.consume(`${this.baseUrl}/reglaVencimiento/listar`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reglaVencimiento/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroCodigoTipoCliente': this.filterObj.codigoTipoCliente != null ? this.filterObj.codigoTipoCliente : "",
      'filtroCodigoMovimiento': this.filterObj.codigoMovimiento != null ? this.filterObj.codigoMovimiento : "",
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  findAllTipoCliente(): Promise<MantenimientoReglaVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/tipoCliente/listarXEstado`, this.filterObj, "get");
  }

  findAllTipoMovimiento(): Promise<MantenimientoReglaVencimientoModel> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listarPorAsignarReglaVencimiento`, { tipoCliente: this.filterObj.codigoTipoCliente }, "get");
  }
  
  findAllPeriodo(filter:any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listar`, {
      'filtroEstado': "1",
      'filtroPadre': filter,
      'pagina': "1",
      'registrosPagina': "1000000",
      'columnaOrdenar': "",
      'orden': ""
    });
  }
}
