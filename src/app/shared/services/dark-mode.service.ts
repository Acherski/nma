import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DarkModeService {
  private darkMode = new BehaviorSubject<string>('');

  get darkMode$(): Observable<string> {
    return this.darkMode.asObservable();
  }

  setMode(value: string) {
    this.darkMode.next(value);
  }
}
