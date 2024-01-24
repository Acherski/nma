import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DarkModeService {
  private darkMode = new BehaviorSubject<boolean>(false);

  get darkMode$(): Observable<boolean> {
    return this.darkMode.asObservable();
  }

  setMode(value: boolean) {
    this.darkMode.next(value);
  }
}
