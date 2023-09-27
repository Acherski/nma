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

  // language
  public setLanguage(language: string) {
    localStorage.setItem('language', language);
  }

  public getLanguage() {
    return localStorage.getItem('language');
  }
}
