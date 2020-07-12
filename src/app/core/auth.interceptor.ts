import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private session: SessionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers
      .set('Content-Type', 'application/json')
  
    if(this.session.loggedInUser) {
      headers.set('Authorization', 'token ' + this.session.loggedInUser.token);
    }

    return next.handle(request.clone({headers: headers}));
  }
}
