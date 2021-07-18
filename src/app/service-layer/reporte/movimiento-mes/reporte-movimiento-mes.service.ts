import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { ReporteMovimientoMesModel } from 'src/app/model-layer/reporte/movimiento-mes/reporte-movimiento-mes.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ReporteMovimientoMesService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: ReporteMovimientoMesModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new ReporteMovimientoMesModel();
  }

  list(): Promise<Array<ReporteMovimientoMesModel>> {
    return this.apiservice.consume(`${this.baseUrl}/reporteMovimientoMes/obtener`, {
      'filtroEstado': "1",
      'pagina': "1",
      'registrosPagina': "250000",
      'columnaOrdenar': "codigo",
      'orden': "desc",
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio,
      'filtroTipoTarjeta': this.filterObj.tipoTarjeta
    });
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteMovimientoMes/obtener`, {
      'filtroEstado': (state == null ? "1" : state),
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort,
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio,
      'filtroTipoTarjeta': this.filterObj.tipoTarjeta
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  findAllTipoTarjeta(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/tipotarjeta/paginacion`, {
      'filtroEstado': '1',
      'pagina': 1,
      'registrosPagina': 100000
    });
  }


}
