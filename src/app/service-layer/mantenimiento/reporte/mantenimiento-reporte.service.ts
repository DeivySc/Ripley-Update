import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoReporteModel } from 'src/app/model-layer/mantenimiento/reporte/mantenimiento-reporte.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoReporteService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: MantenimientoReporteModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoReporteModel();
  }

  findById(codigo: number): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporte/obtener`, {codigo: String(codigo)}, "get", {codigo: String(codigo)});
  }

  save(model: MantenimientoReporteModel): Promise<MantenimientoReporteModel> {
    return this.apiservice.consume(`${this.baseUrl}/reporte/registrar`, model, "post");
  }

  update(model: MantenimientoReporteModel): Promise<MantenimientoReporteModel> {
    return this.apiservice.consume(`${this.baseUrl}/reporte/editar`, model, "put", { codigo: model.codigo });
  }

  updateFieldEstado(model: MantenimientoReporteModel): Promise<MantenimientoReporteModel> {
    return this.apiservice.consume(`${this.baseUrl}/reporte/cambiarEstado`, model, "put", { codigo: model.codigo });
  }

  list(): Promise<Array<MantenimientoReporteModel>> {
    return this.apiservice.consume(`${this.baseUrl}/reporte/listar`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporte/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroDescripcion': "",
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  pageDetail(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteColumna/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroDescripcion': "",
      'filtroReporte': this.filterObj.codigoReporte,
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  findByIdColumna(model:any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteColumna/obtener`, model, "get", model);
  }

  saveColumna(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteColumna/registrar`, model, "post");
  }

  updateColumna(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteColumna/editar`, model, "put", { codigoColumna: model.codigoColumna });
  }

  updateFieldEstadoColumna(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteColumna/cambiarEstado`, model, "put", { codigoColumna: model.codigoColumna });
  }

  pageSubDetail(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteColumnaDetalle/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroDescripcion': "",
      'filtroReporte': this.filterObj.codigoReporte,
      'filtroColumna': this.filterObj.codigoDetail,
      'filtroCodigoMovimiento': '',
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  findAllColumnWithOutAssigned(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listarPorAsignarReporte`, {
      'estado': (state == null ? "1" : state),
      'codigoReporte': this.filterObj.codigoReporte,
      'codigoColumna': this.filterObj.codigoColumna,
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  findAllColumnWithOutAssignedAll(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/parametro/listarPorAsignarReporte`, {
      'estado': "1",
      'codigoReporte': this.filterObj.codigoReporte,
      'codigoColumna': this.filterObj.codigoColumna,
      'pagina': "1",
      'registrosPagina': "100000",
      'columnaOrdenar': "",
      'orden': ""
    });
  }

  saveDetalle(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteColumnaDetalle/registrar`, model, "post");
  }

  updateFieldEstadoDetalle(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteColumnaDetalle/cambiarEstado`, model, "put", { codigoDetalle: model.codigoDetalle });
  }
}
