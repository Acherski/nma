import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogContainerComponent } from 'src/app/design-system/dialog-container/dialog-container.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { requiredNonNullable } from 'src/app/shared/constants/required-nonnullable.constant';
import { ChangeUserAttributeForm } from '../../models/change-user-attribute-form.interface';
import { ChangeUserAttributeDialogData } from '../../models/user-attribute-dialog.interface';
import { TextControlComponent } from 'src/app/design-system/controls/text-control/text-control.component';

@Component({
  standalone: true,
  selector: 'nma-user-attribute-dialog',
  templateUrl: 'user-attribute-dialog.component.html',
  imports: [
    CommonModule,
    DialogContainerComponent,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    TextControlComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAttributeDialogComponent implements OnInit {
  protected editionMode = false;

  protected formGroup = new FormGroup<ChangeUserAttributeForm>({
    attributeName: new FormControl<string>(this.data?.attributeName ?? '', requiredNonNullable),
    attributeValue: new FormControl<string>(this.data?.attributeValue ?? '', requiredNonNullable),
  });

  constructor(
    public dialogRef: DialogRef<ChangeUserAttributeDialogData>,
    @Inject(DIALOG_DATA) public data: { userName: string; attributeName?: string; attributeValue?: string }
  ) {}

  ngOnInit(): void {
    if (this.data.attributeName && this.data.attributeValue) this.editionMode = true;
  }

  onConfirmClick() {
    this.dialogRef.close({
      userName: this.data.userName,
      attributeName: this.formGroup.controls.attributeName.value,
      attributeValue: this.formGroup.controls.attributeValue.value,
    });
  }
}
