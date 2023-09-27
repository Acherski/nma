import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  standalone: true,
  selector: 'nma-dialog-container',
  templateUrl: 'dialog-container.component.html',
  imports: [DialogModule, CommonModule, TranslateModule, MatButtonModule, MatIconModule, SpinnerComponent],
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

  constructor(public dialogRef: DialogRef<string>) {}

  onDismiss() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.confirmClick.emit();
    this.dialogRef.close('true');
  }
}
