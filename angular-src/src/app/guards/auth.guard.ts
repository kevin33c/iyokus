import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (
    private authService:AuthService, 
    private router:Router
  ){}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const userRole = this.authService.userRole();
  const permission = route.data["permission"];
 
  let canActivate: boolean;

  if (!permission) throw new Error('Permissions is not setup!');
  if (!permission.only.length) throw new Error('Roles are not setup!');

  canActivate = permission.only.includes(userRole);

  if (!canActivate) this.router.navigate([permission.redirectTo]);

  return canActivate;
}
  
}
