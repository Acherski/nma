import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  // session token
  public setSessionToken(token: string) {
    localStorage.setItem('token', token);
  }

  public getSessionToken() {
    return localStorage.getItem('token');
  }

  public removeSessionToken() {
    localStorage.removeItem('token');
  }

  public setUserName(userName: string) {
    localStorage.setItem('userName', userName);
  }

  public getUserName() {
    return localStorage.getItem('userName');
  }

  public removeUserName() {
    localStorage.removeItem('userName');
  }

  // language
  public setLanguage(language: string) {
    localStorage.setItem('language', language);
  }

  public getLanguage() {
    return localStorage.getItem('language');
  }
}
