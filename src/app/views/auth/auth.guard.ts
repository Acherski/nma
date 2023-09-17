import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(
    public router: Router,
    private storageService: StorageService
  ) {}

  canActivate(): boolean {
    const isLoggedIn = this.storageService.get('loggedIn');

    if (!isLoggedIn) {
      this.router.navigate(['auth']);
      return false;
    }
    return true;
  }
}
