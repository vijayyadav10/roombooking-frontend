import { Route } from '@angular/compiler/src/core';

import { Injectable } from '@angular/core';


import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRouteGardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    console.log("state of mind ",state);
    if(!this.authService.isAuthenticate){
      this.router.navigate(['login'], {queryParams: {requested: state.url}});
    }
    return this.authService.isAuthenticate;
  }
}
