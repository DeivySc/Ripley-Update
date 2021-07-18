import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { ReporteStockMensualModel } from 'src/app/model-layer/reporte/stock-mensual/reporte-stock-mensual.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ReporteStockMensualService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: ReporteStockMensualModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new ReporteStockMensualModel();
  }

  list(): Promise<Array<ReporteStockMensualModel>> {
    return this.apiservice.consume(`${this.baseUrl}/reporteStockMensual/obtenerCuadre`, {
      'filtroEstado': "1",
      'filtroMovimiento': this.filterObj.tipoSubProducto != null ? this.filterObj.tipoSubProducto : "",
      'pagina': "1",
      'registrosPagina': "250000",
      'columnaOrdenar': "codigo",
      'orden': "desc",
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio
    });
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteStockMensual/obtenerCuadre`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroMovimiento': this.filterObj.tipoSubProducto != null ? this.filterObj.tipoSubProducto : "",
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort,
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  findTipoSubproducto(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/tipotarjeta/paginacion`, {
      'filtroEstado': '1',
      'pagina': 1,
      'registrosPagina': 100000
    });
  }

  fillDetalle(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteStockMensual/obtenerDetalle`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroMovimiento': this.filterObj.tipoSubProducto != null ? this.filterObj.tipoSubProducto : "",
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort,
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio
    });
  }
  
  fillValidar(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteStockMensual/obtenerPuntos`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroMovimiento': this.filterObj.tipoSubProducto != null ? this.filterObj.tipoSubProducto : "",
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort,
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio
    });
  }

  fillLeyenda (page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteStockMensual/listarProducto`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroMovimiento': this.filterObj.tipoSubProducto != null ? this.filterObj.tipoSubProducto : "",
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort,
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio
    });
  }
  

}
