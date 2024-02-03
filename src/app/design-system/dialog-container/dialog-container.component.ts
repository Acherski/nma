import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ButtonComponent } from '../button/button.component';
import { cancelIcon, checkIcon } from 'src/app/shared/constants/icons.constant';

@Component({
  standalone: true,
  selector: 'nma-dialog-container',
  templateUrl: 'dialog-container.component.html',
  imports: [DialogModule, CommonModule, TranslateModule, IconButtonComponent, SpinnerComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContainerComponent {
  @Input() titleHeader = '';
  @Input() customConfirmBtnName?: string;
  @Input() customCancelBtnName?: string;
  @Input() customActionButtons?: boolean;
  @Input() confirmBtnDisabled = false;
  @Input() confirmBtnLoading = false;

  @Output() confirmClick = new EventEmitter<unknown>();

  readonly cancelIcon = cancelIcon;
  readonly checkIcon = checkIcon;

  constructor(public dialogRef: DialogRef<string>) {}

  onDismiss(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.confirmClick.emit();
    this.dialogRef.close('true');
  }
}
