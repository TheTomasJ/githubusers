import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private session: SessionService) {}

  canActivate(next: ActivatedRouteSnapshot)  {
    if(this.session.token) {
      return true;
    }

    this.session.triggerLogin(next.toString());

    return false;
  }
  
}
