import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { ReporteCanjeEstablecimientoModel } from 'src/app/model-layer/reporte/canje-establecimiento/reporte-canje-establecimiento.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ReporteCanjeEstablecimientoService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: ReporteCanjeEstablecimientoModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new ReporteCanjeEstablecimientoModel();
  }

  list(): Promise<Array<ReporteCanjeEstablecimientoModel>> {
    var url = "/reporteCanjeEstablecimiento/obtenerCanjeEstablecimiento";
    if(this.filterObj.tipoReporte == 'A'){
      url = "/reporteCanjeEstablecimiento/obtenerCanjeEstablecimientoAcumulado";
    }else{
      url = "/reporteCanjeEstablecimiento/obtenerCanjeEstablecimiento";
    }

    return this.apiservice.consume(`${this.baseUrl}`+url, {
      'filtroEstado': "1",
      'filtroSucursal': this.filterObj.filtroSucursalEmision,
      'filtroEstablecimientoCanje': this.filterObj.filtroEstablecimientoCanje,
      'filtroPromotor': this.filterObj.filtroPromotora,
      'pagina': "1",
      'registrosPagina': "250000",
      'columnaOrdenar': "codigo",
      'orden': "desc",
      'filtroFechaInicio': this.filterObj.fechaInicio,
      'filtroFechaFin': this.filterObj.fechaFin
    });   
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    var url = "/reporteCanjeEstablecimiento/obtenerCanjeEstablecimiento";
    if(this.filterObj.tipoReporte == 'A'){
      url = "/reporteCanjeEstablecimiento/obtenerCanjeEstablecimientoAcumulado";
    }else{
      url = "/reporteCanjeEstablecimiento/obtenerCanjeEstablecimiento";
    }

    return this.apiservice.consume(`${this.baseUrl}`+url, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroSucursal': this.filterObj.filtroSucursalEmision,
      'filtroEstablecimientoCanje': this.filterObj.filtroEstablecimientoCanje,
      'filtroPromotor': this.filterObj.filtroPromotora,
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort,
      'filtroFechaInicio': this.filterObj.fechaInicio,
      'filtroFechaFin': this.filterObj.fechaFin
    });   
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  ReporteCanjeEstablecimientosExcel(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/ReporteCanjeEstablecimientos/descargarAjustes`, {
      'filtroEstado': '1',
      'pagina': 1,
      'registrosPagina': 100000,
      'filtroFechaInicio': this.filterObj.fechaInicio,
      'filtroFechaFin': this.filterObj.fechaFin,
    });
  }

  fillEstablecimientoCanje(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteCanjeEstablecimiento/listarValorado`, {
      'filtroEstado': '1',
      'pagina': 1,
      'registrosPagina': 100000
    });
  }

  fillSucursalEmision(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/sucursal/listarActivos`, {
      'filtroEstado': '1',
      'pagina': 1,
      'registrosPagina': 100000
    });
  }

  fillPromotora(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteCanjeEstablecimiento/listarValorado`, {
      'filtroEstado': '1',
      'pagina': 1,
      'registrosPagina': 100000,
      'codigoSistema': '37',
      'codigoOpcion': '100'
    });
  }

  
  

}
