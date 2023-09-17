import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarService } from '../services/snackbar.service';
import { StorageService } from '../services/storage.service';

// const websocketURL = 'ws://158.69.251.105:4242';
const websocketURL = 'ws://localhost:4242';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public messages: string[] = [];

  private connected = new BehaviorSubject(false);
  private socket!: WebSocket;
  private requestIndex = 0;
  private router = inject(Router);
  private snackBarService = inject(SnackBarService);
  private storageService = inject(StorageService);

  public get reqIndex() {
    return this.requestIndex;
  }

  public get isConnected$() {
    return this.connected;
  }

  public get webSocket$() {
    return new Observable<string>(observer => {
      this.socket.onmessage = event => observer.next(event.data);
      this.socket.onopen = () => observer.next('connected');
      this.socket.onerror = event => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }

  public increaseReqIndex() {
    this.requestIndex += 1;
  }

  public connect(): Observable<string> {
    this.socket = new WebSocket(websocketURL);
    this.connected.next(true);
    return new Observable(observer => {
      this.socket.onmessage = event => {
        observer.next(event.data);
        this.messages.push(event.data);
      };
      this.socket.onopen = () => observer.next('connected');
      this.socket.onerror = event => observer.error(event);
      this.socket.onclose = () => {
        console.log('WEBSOCKET CLOSED/DISCONNECTED');
        this.storageService.remove('loggedIn');
        observer.complete();
      };
    });
  }

  public disconnect() {
    if (this.socket) this.socket.close();
    this.connected.next(false);
  }

  public getAndSetIndex() {
    const currentIndex = this.reqIndex;
    this.increaseReqIndex();
    return currentIndex;
  }

  public sendMessage(message: string): Observable<string> {
    if (!this.socket) {
      this.snackBarService.showInfoMessage('AUTH.DISCONNECTED');
      this.storageService.remove('loggedIn');
      this.router.navigate(['login']);
    }

    this.socket.send(message);
    console.log(this.socket);
    return new Observable(observer => {
      this.socket.onmessage = event => observer.next(event.data);
    });
  }
}
