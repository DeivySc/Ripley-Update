import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ReglaAcumulacionModel } from '../../../model-layer/reglas/acumulacion/regla-acumulacion.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ApiService } from '../../../utils-layer/api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ReglaAcumulacionService {

  baseUrl: string = environment.BASE_BACKEND;

  isEditing: boolean;
  sharedData: string;

  constructor(private http: HttpClient, private apiservice: ApiService) {   }

  findAllVigente(page: number, size: number, nameColumn?: string, sort?: string): Promise<ReglaAcumulacionModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglaacumulacion/vigente`, {
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  findAllHistorica(page: number, size: number, nameColumn?: string, sort?: string): Promise<ReglaAcumulacionModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglaacumulacion/historica`, {
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  findAllValoradoSucursal(page: number, size: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('filtroEstado', '1');
    params = params.append('filtroCodigoValorado', '4');
    params = params.append('pagina', String(page));
    params = params.append('registrosPagina', String(size));
    return this.http.get(`${this.baseUrl}/valoradoSucursal/listar`, { params }).pipe(
      map((data: any) => data),
      catchError(err => throwError(err))
    )
  }

  findById(id: string): Promise<ReglaAcumulacionModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglaacumulacion`, {id: String(id)}, "get");
  }

  save(model: ReglaAcumulacionModel): Promise<ReglaAcumulacionModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglaacumulacion`, model, "post");
  }

  update(model: ReglaAcumulacionModel, id:string): Promise<ReglaAcumulacionModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglaacumulacion`, model, "put", { id: model.id });
  }

  delete(model: ReglaAcumulacionModel, id:string): Promise<ReglaAcumulacionModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglaacumulacion/eliminar`, model, "put", { id: model.id });
  }

  saveDet(model: any): Promise<String> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglaacumulacion/insertarDetalle`, model, "post");
  }

  getDet(id: number): Promise<Array<any>>{
    return this.apiservice.consume(`${this.baseUrl}/regla/reglaacumulacion/obtenerDetalle`, {
      'id': String(id)
    }, "get");
  }

}