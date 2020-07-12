import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { auth } from 'firebase/app'; import 'firebase/auth';

const TOKEN_KEY = 'githubToken';
const STATE_KEY = 'stateKey';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public token: string;

  constructor(public afAuth: AngularFireAuth, session: SessionService, router: Router, http: HttpClient) {
    this.token = localStorage.getItem(TOKEN_KEY);

    if(!this.token) {
      this.afAuth.getRedirectResult().then((val) => {
        if(val.credential) {
          this.token = (val.credential as unknown as {accessToken: string}).accessToken;
          localStorage.setItem(TOKEN_KEY, this.token);

          let state = localStorage.get(STATE_KEY);
          if(state) {
            router.navigateByUrl(state);
          }
        }
      });
    }
  }

  public triggerLogin() {
    if(!this.token) {
      localStorage.setItem(STATE_KEY, window.location.href);
      this.afAuth.signInWithRedirect(new auth.GithubAuthProvider());
    }
  }

  public logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.token = null;
  }
}
