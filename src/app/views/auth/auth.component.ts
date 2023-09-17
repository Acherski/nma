import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthComponentStore } from './auth-component-store.service';
import { provideComponentStore } from '@ngrx/component-store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthForm } from './models/auth-form-group.interface';
import { createAuthFormGroupUtil } from './utils/create-auth-formgroup';
import { EncodePipe } from 'src/app/utils/pipes/encode.pipe';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextControlComponent } from 'src/app/design-system/controls/text-control/text-control.component';
import { PasswordControlComponent } from 'src/app/design-system/controls/password-control/password-control.component';
import { LoadingState } from 'src/app/constants/callstate.constant';

@Component({
  standalone: true,
  selector: 'nma-auth-component',
  templateUrl: './auth.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    PushPipe,
    TranslateModule,
    LetDirective,
    TextControlComponent,
    PasswordControlComponent,
  ],
  providers: [provideComponentStore(AuthComponentStore), EncodePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  protected formGroup: FormGroup<AuthForm> = createAuthFormGroupUtil();
  protected componentStore = inject(AuthComponentStore);
  private destroyRef = inject(DestroyRef);

  readonly LoadingState = LoadingState;
  asd = 5;
  protected get formValid() {
    let valid = false;

    this.componentStore.authMode$
      .pipe(
        tap(mode => {
          if (mode === 'LOGIN') {
            valid = this.formGroup.controls.login.valid && this.formGroup.controls.password.valid;
          } else if (mode === 'REGISTER') {
            valid =
              this.formGroup.controls.login.valid &&
              this.formGroup.controls.password.valid &&
              this.formGroup.controls.email.valid;
          } else {
            valid =
              this.formGroup.controls.login.valid &&
              this.formGroup.controls.newPassword.valid &&
              this.formGroup.controls.newPasswordReentered.valid &&
              this.formGroup.controls.newPassword.value === this.formGroup.controls.newPasswordReentered.value;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    return valid;
  }
}
