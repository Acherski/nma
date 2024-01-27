import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { SnackBarService } from '../shared/services/snackbar.service';
import { StorageService } from '../shared/services/storage.service';
import { RequestEnum } from './enums/requests.enum';
import { WebSocketEventsEnum } from './enums/websocket-events.enum';

// const websocketURL = 'ws://158.69.251.105:4242';
const websocketURL = 'ws://localhost:4242';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private requestIndex = 0;
  private router = inject(Router);
  private snackBarService = inject(SnackBarService);
  private storageService = inject(StorageService);

  public get reqIndex() {
    return this.requestIndex;
  }

  public get webSocket$() {
    return new Observable<string>(observer => {
      this.socket.onmessage = event => observer.next(event.data);
      this.socket.onopen = () => observer.next('connected');
      this.socket.onerror = event => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }

  public close() {
    this.socket.close();
  }

  public disconnect(): void {
    this.snackBarService.showInfoMessage('AUTH.DISCONNECTED');
    this.storageService.removeSessionToken();
    this.storageService.removeUserName();
    this.router.navigate(['login']);
  }

  public connect(): Observable<string> {
    this.socket = new WebSocket(websocketURL);
    return new Observable(observer => {
      this.socket.onmessage = event => observer.next(event.data);
      this.socket.onopen = () => observer.next(WebSocketEventsEnum.CONNECTED);
      this.socket.onerror = event => observer.error(event);
      this.socket.onclose = () => {
        observer.next(WebSocketEventsEnum.DISCONNECTED);
        observer.complete();
      };
    });
  }

  protected get getAndSetIndex() {
    const currentIndex = this.reqIndex;
    this.requestIndex += 1;
    return currentIndex;
  }

  public sendMessage(message: string): Observable<string> {
    const sessionToken = this.storageService.getSessionToken();

    if (!this.socket && sessionToken) {
      return this.connectAndLoginWithToken(message, sessionToken);
    } else if (!this.socket && !sessionToken) {
      this.disconnect();
      return this.webSocket$;
    } else {
      this.socket.send(message);
      return this.webSocket$;
    }
  }

  private connectAndLoginWithToken(message: string, sessionToken: string): Observable<string> {
    return this.connect().pipe(
      switchMap(() => this.loginWithToken(sessionToken)),
      switchMap(res => {
        if (res.split('|')[4] === '1') {
          this.socket.send(message);
          return this.webSocket$;
        } else {
          this.disconnect();
          return this.webSocket$;
        }
      })
    );
  }

  // AUTH REQUESTS
  public login(login: string, password: string): Observable<string> {
    this.socket.send(`R|${this.getAndSetIndex}|${RequestEnum.LOGIN}|${login}|${password}`);
    return this.webSocket$;
  }

  public loginWithToken(sessionToken: string): Observable<string> {
    this.socket.send(`R|${this.getAndSetIndex}|${RequestEnum.LOGIN_WITH_TOKEN}|${sessionToken}`);
    return this.webSocket$;
  }

  public register(login: string, password: string, email: string): Observable<string> {
    this.socket.send(`R|${this.getAndSetIndex}|${RequestEnum.REGISTER}|${login}|${password}|${email}`);
    return this.webSocket$;
  }

  public changePassword(newPassword: string, oldPassword?: string): Observable<string> {
    return this.sendMessage(
      `R|${this.getAndSetIndex}|${RequestEnum.CHANGE_PASSWORD}|${oldPassword ?? ''}|${newPassword}`
    );
  }

  public changePasswordAdminMode(userName: string, newPassword: string, enforceChange: boolean): Observable<string> {
    return this.sendMessage(
      `R|${this.getAndSetIndex}|${RequestEnum.CHANGE_PASSWORD_ADMIN_MODE}|${userName}|${newPassword}|${Number(
        enforceChange
      )}`
    );
  }
}
