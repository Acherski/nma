import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingState } from 'src/app/shared/constants/callstate.constant';
import { PasswordControlComponent } from 'src/app/design-system/controls/password-control/password-control.component';
import { DialogContainerComponent } from 'src/app/design-system/dialog-container/dialog-container.component';
import { selectAuthCallState } from 'src/app/auth/store/auth.selectors';
import { requiredNonNullable } from 'src/app/shared/constants/required-nonnullable.constant';

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
})
export class ChangeOwnPasswordDialogComponent {
  protected callState$ = this.store.select(selectAuthCallState);
  protected formGroup = new FormGroup({
    oldPassword: new FormControl<string>('', requiredNonNullable),
    newPassword: new FormControl<string>('', requiredNonNullable),
    reenterNewPassword: new FormControl<string>('', requiredNonNullable),
  });

  readonly LoadingState = LoadingState;

  constructor(
    public dialogRef: DialogRef<{ oldPassword: string; newPassword: string }>,
    private store: Store
  ) {}

  protected get passwordsDontMatch(): boolean {
    return (
      this.formGroup.controls.newPassword.value !== this.formGroup.controls.reenterNewPassword.value &&
      this.formGroup.controls.newPassword.touched &&
      this.formGroup.controls.reenterNewPassword.touched
    );
  }

  protected get formValid(): boolean {
    return (
      this.formGroup.valid &&
      this.formGroup.controls.newPassword.value === this.formGroup.controls.reenterNewPassword.value
    );
  }

  protected onConfirmClick(): void {
    this.dialogRef.close({
      oldPassword: this.formGroup.controls.oldPassword.value,
      newPassword: this.formGroup.controls.newPassword.value,
    });
  }
}
