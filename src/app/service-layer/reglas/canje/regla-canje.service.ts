import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReglaCanjeModel } from '../../../model-layer/reglas/canje/regla-canje.model';
import { environment } from '@environments/environment';
import { ApiService } from '../../../utils-layer/api-service/api-service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReglaCanjeService {
  baseUrl: string = environment.BASE_BACKEND;
  private apiservice: ApiService;

  isEditing: boolean;
  sharedData: string;

  constructor(private _http: HttpClient) { 
    this.apiservice = new ApiService(_http);
  }

  findAllVigente(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanje/vigente`, {
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }

  findAllHistorica(page: number, size: number, nameColumn?: string, sort?: string): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanje/historica`, {
      'pagina': String(page),
      'registrosPagina': String(size),
      'columnaOrdenar': nameColumn,
      'orden': sort
    });
  }
  
  findAllTarjetas(): Promise<ReglaCanjeModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanje/tarjeta`, {}, "get");
  }

  findAllTipoTarjetas(): Observable<any> {
    return this._http.get(`${this.baseUrl}/regla/reglacanje/tipotarjeta`).pipe(
      map((data: any) => data),
      catchError(err => throwError(err))
    )
  }

  findAllTipoTarjeta(): Promise<any> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanje/tipotarjeta`, {}, "get");
  }
  
  findById(id: string): Promise<ReglaCanjeModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanje`, {id: String(id)}, "get");
  }

  save(model: ReglaCanjeModel): Promise<ReglaCanjeModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanje`, model, "post");
  }

  update(model: ReglaCanjeModel, id:string): Promise<ReglaCanjeModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanje`, model, "put", { id: model.id });
  }

  delete(model: ReglaCanjeModel, id:string): Promise<ReglaCanjeModel> {
    return this.apiservice.consume(`${this.baseUrl}/regla/reglacanje/eliminar`, model, "put", { id: model.id });
  }

}