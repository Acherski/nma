import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(
    public router: Router,
    private storageService: StorageService
  ) {}

  canActivate(): boolean {
    const sessionToken = this.storageService.getSessionToken();

    if (!sessionToken) {
      this.router.navigate(['auth']);
      return false;
    }
    return true;
  }
}
