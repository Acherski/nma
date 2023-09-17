import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { AuthComponentStore } from '../../../views/auth/auth-component-store.service';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { LetDirective } from '@ngrx/component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ChangeOwnPasswordDialogComponent } from './change-own-password-dialog/change-own-password-dialog.component';

@Component({
  selector: 'nma-header',
  standalone: true,
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, TranslateModule, LetDirective, CommonModule],
  providers: [provideComponentStore(AuthComponentStore)],
})
export class HeaderComponent {
  @Input({ required: true }) label = '';

  constructor(
    private authComponentStore: AuthComponentStore,
    private dialog: Dialog
  ) {}

  protected onLogOut() {
    this.authComponentStore.logout();
  }

  protected onChangePassword() {
    const dialogRef = this.dialog.open<{ oldPassword: string; newPassword: string }>(ChangeOwnPasswordDialogComponent, {
      width: '350px',
    });

    dialogRef.closed.subscribe(result => {
      if (result)
        this.authComponentStore.changeYourOwnPassword({
          oldPassword: result.oldPassword,
          newPassword: result.newPassword,
        });
    });
  }
}
