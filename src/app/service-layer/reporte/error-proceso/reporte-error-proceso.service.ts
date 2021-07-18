import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { ReporteErrorProcesoModel } from 'src/app/model-layer/reporte/error-proceso/reporte-error-proceso.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ReporteErrorProcesoService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: ReporteErrorProcesoModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new ReporteErrorProcesoModel();
  }

  list(): Promise<Array<ReporteErrorProcesoModel>> {
    return this.apiservice.consume(`${this.baseUrl}/reporteErroresProcesos/obtener`, {
      'filtroEstado': "1",
      'filtroCodigoTipoCliente': this.filterObj.codigoTipoCliente != null ? this.filterObj.codigoTipoCliente : "",
      'filtroCodigoMovimiento': this.filterObj.codigoMovimiento != null ? this.filterObj.codigoMovimiento : "",
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
    return this.apiservice.consume(`${this.baseUrl}/reporteErroresProcesos/obtener`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroCodigoTipoCliente': this.filterObj.codigoTipoCliente != null ? this.filterObj.codigoTipoCliente : "",
      'filtroCodigoMovimiento': this.filterObj.codigoMovimiento != null ? this.filterObj.codigoMovimiento : "",
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
