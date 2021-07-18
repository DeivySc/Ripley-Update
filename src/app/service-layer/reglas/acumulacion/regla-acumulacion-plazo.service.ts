import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ReglaAcumulacionModel } from '../../../model-layer/reglas/acumulacion/regla-acumulacion.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

import { ApiService } from '../../../utils-layer/api-service/api-service';
import { ReglaAcumulacionPlazoModel } from 'src/app/model-layer/reglas/acumulacion/regla-acumulacion-plazo.model';

@Injectable({
  providedIn: 'root'
})
export class ReglaAcumulacionPlazoService {

  baseUrl: string = environment.BASE_BACKEND;

  filterObj: ReglaAcumulacionPlazoModel;

  isEditing: boolean;
  sharedData: string;

  constructor(private http: HttpClient, private apiservice: ApiService) {
    this.filterObj = new ReglaAcumulacionPlazoModel();
  }

  list(): Promise<Array<ReglaAcumulacionPlazoModel>> {
      return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/plazos`, {
        'filtroEstado': '1'
      });
  }

  page(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/cuenta/puntocuenta/plazos/paginacion`, {
      'filtroEstado': '1',
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

}