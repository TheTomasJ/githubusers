import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private session: SessionService) {}

  canActivate(next: ActivatedRouteSnapshot)  {
    if(this.session.loggedInUser) {
      return true;
    }

    this.session.triggerLogin(next.url.join(''));

    return false;
  }
  
}
