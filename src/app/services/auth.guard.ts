import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private _tokenStorageService: TokenStorageService,
    private _authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // console.log("*****guard*****");
    // this._authService.currentToken.subscribe((data) => {
    //   console.log("data-guard:", data);
    // })
    if (localStorage.getItem("login")) {
      return true;
    }
    return false;
  }
}
