import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoEmailProcesoModel } from 'src/app/model-layer/mantenimiento/email-proceso/mantenimiento-email-proceso.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoEmailProcesoService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: MantenimientoEmailProcesoModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoEmailProcesoModel();
  }

  findById(id: number): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/envioMail/obtener`, {id: String(id)}, "get");
  }

  save(model: MantenimientoEmailProcesoModel): Promise<MantenimientoEmailProcesoModel> {
    return this.apiservice.consume(`${this.baseUrl}/envioMail/registrar`, model, "post");
  }

  update(model: MantenimientoEmailProcesoModel): Promise<MantenimientoEmailProcesoModel> {
    return this.apiservice.consume(`${this.baseUrl}/envioMail/editar`, model, "put", { id: model.id });
  }

  updateFieldEstado(model: MantenimientoEmailProcesoModel): Promise<MantenimientoEmailProcesoModel> {
    return this.apiservice.consume(`${this.baseUrl}/envioMail/cambiarEstado`, model, "put", { id: model.id });
  }

  list(): Promise<Array<MantenimientoEmailProcesoModel>> {
    return this.apiservice.consume(`${this.baseUrl}/envioMail/listar`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/envioMail/listar`, {
      'filtroEstado': (state == null ? "1" : state),
      'filtroCodigoProceso': this.filterObj.codigoProceso != null ? this.filterObj.codigoProceso : "",
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }

  findAllProcesos(): Promise<MantenimientoEmailProcesoModel> {
    return this.apiservice.consume(`${this.baseUrl}/proceso/listar`, {});
  }
}
