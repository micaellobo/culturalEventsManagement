import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SessionService } from '../services/auth/session.service';

@Injectable({
  providedIn: 'root'
})
export class JwtClientGuard implements CanActivate {

  constructor(private router: Router, private sessionService: SessionService) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.sessionService.isClient()) {
      return true

    }
    this.router.navigate(['/login']);
    return false;
  }

}
