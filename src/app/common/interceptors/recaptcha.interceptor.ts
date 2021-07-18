import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import {
  ROUTES_WITH_RECAPTCHA_VALIDATION,
  RECAPTCHA_ACTION_KEY
} from '@common/constants/recaptcha.constants';
import { ROUTE_TOKEN_VALIDATION } from '@common/constants/token-market.constants';

@Injectable()
export class RecaptchaInterceptor implements HttpInterceptor {

  constructor(
    public router: Router,
    private recaptchaService: ReCaptchaV3Service
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const matches = ROUTES_WITH_RECAPTCHA_VALIDATION.filter(routes => request.url.includes(routes.route));
    if (matches.length === 1) {
      const matchesToken = ROUTE_TOKEN_VALIDATION.filter(routes => request.url.includes(routes.route));
      if(matchesToken.length===0){
        return from(this.getRecaptchaToken(RECAPTCHA_ACTION_KEY))
        .pipe(
          switchMap((recaptchaToken: string) => {
            let requestClone;
            if (typeof(request.body) === 'string') {
              requestClone = request.clone({
                body: request.body + `&${matches[0].requestKey}=${recaptchaToken}`,
              });
            } else if (typeof(request.body) === 'object') {
              requestClone = request.clone({
                body: {
                  ...request.body,
                  [matches[0].requestKey]: recaptchaToken
                },
              });
            }
            return next.handle(requestClone);
          })
         );
      }
    }

    return next.handle(request);
  }

  private getRecaptchaToken(actionKey: string) {
    return this.recaptchaService.execute(actionKey);
  }
}
