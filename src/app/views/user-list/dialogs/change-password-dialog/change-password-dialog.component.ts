import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogContainerComponent } from 'src/app/design-system/dialog-container/dialog-container.component';
import { ChangePasswordForm } from '../../models/change-password-form.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangePasswordDialogData } from './password-dialog-data.interface';
import { PasswordControlComponent } from 'src/app/design-system/controls/password-control/password-control.component';
import { CheckboxControlComponent } from 'src/app/design-system/controls/checkbox-control/checkbox-control.component';

@Component({
  standalone: true,
  selector: 'nma-change-password-dialog',
  templateUrl: 'change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
  imports: [
    CommonModule,
    DialogContainerComponent,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordControlComponent,
    CheckboxControlComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  protected formGroup = new FormGroup<ChangePasswordForm>({
    newPassword: new FormControl<string>('', { nonNullable: true }),
    enforceChange: new FormControl<boolean>(false, { nonNullable: true }),
  });

  constructor(
    public dialogRef: DialogRef<ChangePasswordDialogData>,
    @Inject(DIALOG_DATA) public data: { userName: string }
  ) {}

  onConfirmClick() {
    this.dialogRef.close({
      userName: this.data.userName,
      newPassword: this.formGroup.controls.newPassword.value,
      enforceChange: this.formGroup.controls.enforceChange.value,
    });
  }
}
