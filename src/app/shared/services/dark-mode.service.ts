import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DarkModeService {
  private darkMode = new Subject<boolean>();

  get darkMode$(): Observable<boolean> {
    return this.darkMode.asObservable();
  }

  setMode(value: boolean) {
    this.darkMode.next(value);
  }
}
