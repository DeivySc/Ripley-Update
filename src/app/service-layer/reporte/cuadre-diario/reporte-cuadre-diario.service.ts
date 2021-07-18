import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { ReporteCuadreDiarioModel } from 'src/app/model-layer/reporte/cuadre-diario/reporte-cuadre-diario.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ReporteCuadreDiarioService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: ReporteCuadreDiarioModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new ReporteCuadreDiarioModel();
  }

  list(): Promise<Array<ReporteCuadreDiarioModel>> {
    return this.apiservice.consume(`${this.baseUrl}/reporteCuadreDiario/obtener`, {
      'filtroEstado': "1",
      'pagina': "1",
      'registrosPagina': "250000",
      'columnaOrdenar': "codigo",
      'orden': "desc",
      'filtroFechaInicio': this.filterObj.fechaInicio,
      'filtroFechaFin': this.filterObj.fechaFin,
      'filtroTipoTarjeta': this.filterObj.tipoTarjeta
    });
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteCuadreDiario/obtener`, {
      'filtroEstado': (state == null ? "1" : state),
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort,
      'filtroFechaInicio': this.filterObj.fechaInicio,
      'filtroFechaFin': this.filterObj.fechaFin,
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
