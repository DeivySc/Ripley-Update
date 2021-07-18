import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import { TipoTarjetaModel } from '../model-layer/tipo-tarjeta.model';
import { ApiService } from '../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class TipoTarjetaService {

  sharedData: string;
  baseUrl: string = environment.BASE_BACKEND;

  private apiservice: ApiService;
  
  constructor(_http: HttpClient) { 
    this.apiservice = new ApiService(_http);
  }

  list(): Promise<Array<TipoTarjetaModel>> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/tipotarjeta`, {});
  }

  page(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/tipotarjeta/paginacion`, {
      'filtroEstado': '1',
      'pagina': String(page),
      'registrosPagina': String(size)/*,
      'columnaOrdenar': nameColumn,
      'orden': sort*/
    });
  }
}
