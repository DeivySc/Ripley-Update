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
  RECAPTCHA_ACTION_KEY, ROUTES_WITHOUT_RECAPTCHA_HEADER
} from '@common/constants/recaptcha.constants';
import { environment } from '@environments/environment';
import { ROUTE_TOKEN_VALIDATION } from '@common/constants/token-market.constants';

@Injectable()
export class CloudFlareInterceptor implements HttpInterceptor {

  constructor(
    public router: Router,
    private recaptchaService: ReCaptchaV3Service
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const [clientId, clientSecret] = [environment.CLIENT_ID, environment.CLIENT_SECRET]

    const matches = ROUTES_WITHOUT_RECAPTCHA_HEADER.filter(route => request.url.includes(route));

    if(matches.length > 0) return next.handle(request);
      const authToken = btoa(`${clientId}:${clientSecret}`);
      return from(this.getRecaptchaToken(RECAPTCHA_ACTION_KEY))
      .pipe(
        switchMap((recaptchaToken: string) => {
          let requestClone;
          requestClone = request.clone({
            setHeaders: {
              'x-recaptcha-response': recaptchaToken,
              'x-auth-token': `Basic ${authToken}`
            },
          });
          return next.handle(requestClone);
      })
      );   
  }

  private getRecaptchaToken(actionKey: string) {
    return this.recaptchaService.execute(actionKey);
  }
}
