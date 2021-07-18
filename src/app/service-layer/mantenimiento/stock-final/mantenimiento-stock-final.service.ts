import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '@environments/environment';
import { MantenimientoStockFinalModel } from 'src/app/model-layer/mantenimiento/stock-final/mantenimiento-stock-final.model';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoStockFinalService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  filterObj: MantenimientoStockFinalModel;
  
  isEditing: boolean;
  sharedData: string;

  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
    this.filterObj = new MantenimientoStockFinalModel();
  }

  save(model: MantenimientoStockFinalModel): Promise<MantenimientoStockFinalModel> {
    return this.apiservice.consume(`${this.baseUrl}/stockFinal/registrar`, model, "post");
  }

  list(): Promise<Array<MantenimientoStockFinalModel>> {
    return this.apiservice.consume(`${this.baseUrl}/stockFinal/listar`, {});
  }
  
  page(page: number, size: number, nameColumn?: string, sort?: string, state?:string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/stockFinal/listar`, {
      'filtroTarjetas': this.filterObj.listaTarjetas,
      'filtroMes': this.filterObj.mes,
      'filtroAnio': this.filterObj.anio,
      'usuario': '',
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  all(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.page(page, size, nameColumn, sort, "");
  }
}
