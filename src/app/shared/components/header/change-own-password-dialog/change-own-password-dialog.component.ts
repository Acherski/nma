import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LetDirective } from '@ngrx/component';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingState } from 'src/app/constants/callstate.constant';
import { PasswordControlComponent } from 'src/app/design-system/controls/password-control/password-control.component';
import { DialogContainerComponent } from 'src/app/design-system/dialog-container/dialog-container.component';
import { AuthComponentStore } from 'src/app/views/auth/auth-component-store.service';

@Component({
  standalone: true,
  selector: 'nma-change-own-password-dialog',
  templateUrl: 'change-own-password-dialog.component.html',
  imports: [
    DialogContainerComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PasswordControlComponent,
    LetDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(AuthComponentStore)],
})
export class ChangeOwnPasswordDialogComponent {
  protected formGroup = new FormGroup({
    oldPassword: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
    newPassword: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
    reenterNewPassword: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
  });

  readonly LoadingState = LoadingState;

  constructor(
    public dialogRef: DialogRef<{ oldPassword: string; newPassword: string }>,
    protected componentStore: AuthComponentStore
  ) {}

  protected get formValid() {
    return (
      this.formGroup.valid &&
      this.formGroup.controls.newPassword.value === this.formGroup.controls.reenterNewPassword.value
    );
  }

  onConfirmClick() {
    this.dialogRef.close({
      oldPassword: this.formGroup.controls.oldPassword.value,
      newPassword: this.formGroup.controls.newPassword.value,
    });
  }
}
