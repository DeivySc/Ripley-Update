import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {formatDate} from '@angular/common';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: "root"
})
export class ApiService {
    constructor(private http: HttpClient) { }

    public get(_service:any, _params:any): Promise<any> {
        let _httpparams = new HttpParams();
        for(let k of Object.keys(_params)){  
            _httpparams = _httpparams.append(k, _params[k]);
        }

        return this.http
            .get<any>(_service, { params: _httpparams })
            .pipe(
                retry(0)
            ).toPromise();
    }

    public post(_service:any, _params:any, _paramshttp?:any): Promise<any> {
        const _headers = new HttpHeaders().set('Content-Type',  environment.contentType);

        return this.http
            .post<any>(_service, JSON.stringify(_params), { headers: _headers, params: _paramshttp})
            .pipe(
                retry(0)
            ).toPromise();
    }

    public put(_service:any, _params:any, _paramshttp?:any): Promise<any> {
        const _headers = new HttpHeaders().set('Content-Type',  environment.contentType);

        return this.http
            .put<any>(_service, JSON.stringify(_params), { headers: _headers, params: _paramshttp})
            .pipe(
                retry(0)
            ).toPromise();
    }

    public consume(_service:any, params:any, method?:string, _paramshttp?:any): Promise<any> {
        if(method == "get" || method == null){
            return this.get(_service, params);
        }else if(method == "put" || method == null){
            return this.put(_service, params, _paramshttp);
        }else{
            return this.post(_service, params, _paramshttp);
        }
    }    
  }