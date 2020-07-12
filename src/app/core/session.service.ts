import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app'; import 'firebase/auth';

const SESSION_KEY = 'sessionKey';
const STATE_KEY = 'stateKey';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public loggedInUser: {token: string, username: string};
  public initialized: boolean;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.loggedInUser = JSON.parse(localStorage.getItem(SESSION_KEY));

    if(this.loggedInUser) {
      this.initialized = true;
    }
    else {
      this.afAuth.getRedirectResult().then((val) => {
        
        if(val.credential) {
          this.loggedInUser = {
            token: (val.credential as unknown as {accessToken: string}).accessToken,
            username: val.additionalUserInfo.username
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(this.loggedInUser));
          
          let state = localStorage.getItem(STATE_KEY);
          if(state) {
            router.navigateByUrl(state);
          }
        }
  
        this.initialized = true;
      });
    }
  }

  public triggerLogin(next: string) {
    localStorage.setItem(STATE_KEY, next);
    this.afAuth.signInWithRedirect(new auth.GithubAuthProvider());
  }

  public logout() {
    localStorage.removeItem(SESSION_KEY);
    this.loggedInUser = null;
    this.router.navigateByUrl('/');
  }
}
