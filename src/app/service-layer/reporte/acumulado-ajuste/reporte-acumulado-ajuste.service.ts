import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { ReporteAcumuladoAjusteModel } from 'src/app/model-layer/reporte/acumulado-ajuste/reporte-acumulado-ajuste.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ReporteAcumuladoAjusteService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: ReporteAcumuladoAjusteModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new ReporteAcumuladoAjusteModel();
  }

  list(): Promise<Array<ReporteAcumuladoAjusteModel>> {
    return this.apiservice.consume(`${this.baseUrl}/reporteAcumuladoAjustes/obtenerAcumuladoMensualTotal`, {
      'filtroEstado': "1",
      'filtroCodigoTipoCliente': this.filterObj.codigoTipoCliente != null ? this.filterObj.codigoTipoCliente : "",
      'filtroCodigoMovimiento': this.filterObj.codigoMovimiento != null ? this.filterObj.codigoMovimiento : "",
      'pagina': "1",
      'registrosPagina': "250000",
      'columnaOrdenar': "codigo",
      'orden': "desc",
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio
    });
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteAcumuladoAjustes/obtenerAcumuladoMensualTotal`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroCodigoTipoCliente': this.filterObj.codigoTipoCliente != null ? this.filterObj.codigoTipoCliente : "",
      'filtroCodigoMovimiento': this.filterObj.codigoMovimiento != null ? this.filterObj.codigoMovimiento : "",
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
}
