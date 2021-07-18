import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import { PlazoModel } from '../model-layer/plazo.model';
import { ApiService } from '../utils-layer/api-service/api-service';

@Injectable({
    providedIn: 'root'
})
export class PlazoService {

    sharedData: string;
    baseUrl: string = environment.BASE_BACKEND;
    
    private apiservice: ApiService;

    constructor(_http: HttpClient) { 
        this.apiservice = new ApiService(_http);
    }

    list(): Promise<Array<PlazoModel>> {
        return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/plazos`, {});
    }

    page(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
      return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/plazos/paginacion`, {
        'filtroEstado': '1',
        'pagina': String(page),
        'registrosPagina': String(size)/*,
        'columnaOrdenar': nameColumn,
        'orden': sort*/
      });
    }
}
