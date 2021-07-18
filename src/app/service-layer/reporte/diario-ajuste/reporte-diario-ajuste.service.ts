import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { ReporteDiarioAjusteModel } from 'src/app/model-layer/reporte/diario-ajuste/reporte-diaro-ajuste.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ReporteDiarioAjusteService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: ReporteDiarioAjusteModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new ReporteDiarioAjusteModel();
  }

  list(): Promise<Array<ReporteDiarioAjusteModel>> {
    return this.apiservice.consume(`${this.baseUrl}/reporteDiarioAjustes/obtener`, {
      'filtroEstado': "1",
      'pagina': "1",
      'registrosPagina': "250000",
      'columnaOrdenar': "codigo",
      'orden': "desc",
      'filtroFecha': this.filterObj.fechaInicio,
      'filtroCodigosAjuste': ''
    });
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/reporteDiarioAjustes/obtener`, {
      'filtroEstado': (state == null ? "1" : state),
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort,
      'filtroFecha': this.filterObj.fechaInicio,
      'filtroCodigosAjuste': ''
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
