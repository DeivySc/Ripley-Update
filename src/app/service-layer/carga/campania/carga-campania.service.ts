import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { CargaCampaniaModel } from 'src/app/model-layer/carga/campania/carga-campania.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class CargaCampaniaService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: CargaCampaniaModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new CargaCampaniaModel();
  }

  save(model: CargaCampaniaModel): Promise<CargaCampaniaModel> {
    return this.apiservice.consume(`${this.baseUrl}/campania/registrarPreCarga`, model, "post");
  }

  list(): Promise<Array<CargaCampaniaModel>> {
    return this.apiservice.consume(`${this.baseUrl}/campania/listarCampaniaCabecera`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/campania/listarCampaniaCabecera`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroCodigoAjuste': (this.filterObj.codigoAjuste ? String(this.filterObj.codigoAjuste) : ''),
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  findAllCampanias(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/ajuste`, {}, "get");
  }

  findAllCampaniaDetalle(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/campania/listarCampaniaDetalle`, {
      'filtroCabecera': this.filterObj.idCabecera,
      'filtroCheck': '',
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  findAllCampaniaDetalleAll(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/campania/listarCampaniaDetalle`, {
      'filtroCabecera': this.filterObj.idCabecera,
      'filtroCheck': '0',
      'pagina': "1",
      'registrosPagina': "1000000",
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  saveDetalle(model: any): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/campania/procesarCampania`, model, "post");
  }
}
