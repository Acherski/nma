import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogContainerComponent } from 'src/app/design-system/dialog-container/dialog-container.component';

@Component({
  standalone: true,
  selector: 'nma-delete-user-dialog',
  templateUrl: 'delete-user-dialog.component.html',
  imports: [DialogContainerComponent, TranslateModule],
})
export class DeleteUserDialogComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: { userName: string }
  ) {}
}
