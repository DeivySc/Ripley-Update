import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ApiService } from '../../../utils-layer/api-service/api-service';
import { ReglaValoradoModel } from '../../../model-layer/reglas/valorado/regla-valorado.model';

@Injectable({
  providedIn: 'root'
})
export class ReglaValoradoService {

  baseUrl: string = environment.BASE_BACKEND;

  filterObj: ReglaValoradoModel;

  isEditing: boolean;
  sharedData: string;

  constructor(private http: HttpClient, private apiservice: ApiService) { 
    this.filterObj = new ReglaValoradoModel();
  }

  findAllVigente(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado/vigente`, {
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  findAllHistorica(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado/historica`, {
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

  findAllEstablecimientos(): Promise<ReglaValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado/establecimiento`, {}, "get");
  }

  findAllValorados(params: ReglaValoradoModel): Promise<ReglaValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado/valorado`, {codEstablecimiento: params.codEstablecimiento}, "get");
  }

  findById(id: string): Promise<ReglaValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado`, {id: String(id)}, "get");
  }

  save(model: ReglaValoradoModel): Promise<ReglaValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado`, model, "post");
  }

  update(model: ReglaValoradoModel, id:string): Promise<ReglaValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado`, model, "put", { id: model.id });
  }

  delete(model: ReglaValoradoModel, id:string): Promise<ReglaValoradoModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanjevalorado/eliminar`, model, "put", { id: model.id });
  }
}