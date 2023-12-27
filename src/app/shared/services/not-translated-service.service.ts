import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotTranslatedService {
  notTranslated(key: string) {
    return key;
  }
}
