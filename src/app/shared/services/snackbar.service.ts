import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  // popup duration in miliseconds
  defaultDuration = 5000;

  constructor(
    private translateService: TranslateService,
    private matsnack: MatSnackBar
  ) {}

  private configSuccess: MatSnackBarConfig = {
    panelClass: ['success-snackbar'],
    duration: this.defaultDuration,
  };

  private configError: MatSnackBarConfig = {
    panelClass: ['error-snackbar'],
    duration: this.defaultDuration,
  };

  private configInfo: MatSnackBarConfig = {
    panelClass: ['info-snackbar'],
    duration: this.defaultDuration,
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
