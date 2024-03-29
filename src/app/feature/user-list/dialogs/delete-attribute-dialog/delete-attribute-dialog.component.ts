import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogContainerComponent } from 'src/app/design-system/dialog-container/dialog-container.component';

@Component({
  standalone: true,
  selector: 'nma-delete-attribute-dialog',
  templateUrl: 'delete-attribute-dialog.component.html',
  imports: [DialogContainerComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAttributeDialogComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: { userName: string; attribute: string }
  ) {}

  onConfirmDelete() {
    this.dialogRef.close('true');
  }
}
