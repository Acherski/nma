import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { LetDirective } from '@ngrx/component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ChangeOwnPasswordDialogComponent } from './change-own-password-dialog/change-own-password-dialog.component';
import { authChangePassword, authLogout } from 'src/app/auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageMenuComponent } from 'src/app/design-system/language-menu/language-menu.component';

@Component({
  selector: 'nma-header',
  standalone: true,
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, TranslateModule, LetDirective, CommonModule, MatMenuModule, LanguageMenuComponent],
})
export class HeaderComponent {
  @Input({ required: true }) label = '';

  constructor(
    private store: Store,
    private dialog: Dialog
  ) {}

  protected onLogOut() {
    this.store.dispatch(authLogout());
  }

  protected onChangePassword() {
    const dialogRef = this.dialog.open<{ oldPassword: string; newPassword: string }>(ChangeOwnPasswordDialogComponent, {
      width: '350px',
    });

    dialogRef.closed.subscribe(result => {
      if (result?.newPassword)
        this.store.dispatch(
          authChangePassword({
            oldPassword: result.oldPassword,
            newPassword: result.newPassword,
          })
        );
    });
  }
}
