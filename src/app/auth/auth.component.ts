import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslateModule } from '@ngx-translate/core';
import { EncodePipe } from 'src/app/shared/utils/pipes/encode.pipe';
import { distinctUntilChanged, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextControlComponent } from 'src/app/design-system/controls/text-control/text-control.component';
import { PasswordControlComponent } from 'src/app/design-system/controls/password-control/password-control.component';
import { LoadingState } from 'src/app/shared/constants/callstate.constant';
import { Store } from '@ngrx/store';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Router } from '@angular/router';
import { LanguageMenuComponent } from 'src/app/design-system/language-menu/language-menu.component';
import { AuthModeEnum } from './enums/auth-mode.enum';
import { AuthForm } from './models/auth-form-group.interface';
import { authLogin, authRegister, authChangePassword, authSwitchMode } from './store/auth.actions';
import { selectAuthCallState, selectAuthMode } from './store/auth.selectors';
import { createAuthFormGroupUtil } from './utils/create-auth-formgroup';
import { ButtonComponent } from '../design-system/button/button.component';

@Component({
  standalone: true,
  selector: 'nma-auth-component',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PushPipe,
    TranslateModule,
    LetDirective,
    TextControlComponent,
    PasswordControlComponent,
    LanguageMenuComponent,
    ButtonComponent,
  ],
  providers: [EncodePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  protected formGroup: FormGroup<AuthForm> = createAuthFormGroupUtil();
  protected callState$ = this.store.select(selectAuthCallState);
  protected authMode$ = this.store.select(selectAuthMode);
  private destroyRef = inject(DestroyRef);

  readonly LoadingState = LoadingState;
  readonly AuthModeEnum = AuthModeEnum;

  constructor(
    private store: Store,
    private storageService: StorageService,
    private router: Router
  ) {
    if (this.storageService.getSessionToken()) this.router.navigate(['users']);
  }

  ngOnInit(): void {
    this.authMode$
      .pipe(
        distinctUntilChanged(),
        tap(() => this.resetForm()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected get formValid(): boolean {
    let formValid = false;

    this.authMode$
      .pipe(
        tap(mode => {
          if (mode === AuthModeEnum.LOGIN) {
            formValid = this.formGroup.controls.login.valid && this.formGroup.controls.password.valid;
          } else if (mode === AuthModeEnum.REGISTER) {
            formValid =
              this.formGroup.controls.login.valid &&
              this.formGroup.controls.password.valid &&
              this.formGroup.controls.email.valid;
          } else {
            formValid =
              this.formGroup.controls.login.valid &&
              this.formGroup.controls.newPassword.valid &&
              this.formGroup.controls.newPasswordReentered.valid &&
              this.formGroup.controls.newPassword.value === this.formGroup.controls.newPasswordReentered.value;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    return formValid;
  }

  protected login(login: string, password: string): void {
    this.store.dispatch(authLogin({ login, password }));
  }

  protected register(login: string, password: string, email: string): void {
    this.store.dispatch(authRegister({ login, password, email }));
  }

  protected changeYourOwnPassword(newPassword: string): void {
    this.store.dispatch(authChangePassword({ newPassword }));
  }

  protected switchMode(): void {
    this.store.dispatch(authSwitchMode());
  }

  private resetForm(): void {
    this.formGroup.reset();
    this.formGroup.controls.login.setErrors(null);
    this.formGroup.controls.password.setErrors(null);
    this.formGroup.controls.newPassword.setErrors(null);
    this.formGroup.controls.newPasswordReentered.setErrors(null);
    this.formGroup.controls.email.setErrors(null);
  }
}
