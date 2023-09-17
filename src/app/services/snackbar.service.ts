import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  private matsnack = inject(MatSnackBar);
  private translateService = inject(TranslateService);

  private configSuccess: MatSnackBarConfig = {
    panelClass: ['success-snackbar'],
    duration: 5000,
  };

  private configError: MatSnackBarConfig = {
    panelClass: ['error-snackbar'],
    duration: 5000,
  };

  private configInfo: MatSnackBarConfig = {
    panelClass: ['info-snackbar'],
    duration: 5000,
  };

  showSuccessMessage(message: string) {
    this.matsnack.open(
      this.translateService.instant(message),
      this.translateService.instant('BUTTON.CLOSE'),
      this.configSuccess
    );
  }

  showErrorMessage(message: string) {
    this.matsnack.open(
      this.translateService.instant(message),
      this.translateService.instant('BUTTON.CLOSE'),
      this.configError
    );
  }

  showInfoMessage(message: string) {
    this.matsnack.open(
      this.translateService.instant(message),
      this.translateService.instant('BUTTON.CLOSE'),
      this.configInfo
    );
  }
}
