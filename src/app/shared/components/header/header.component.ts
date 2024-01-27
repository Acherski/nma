import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LetDirective } from '@ngrx/component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ChangeOwnPasswordDialogComponent } from './change-own-password-dialog/change-own-password-dialog.component';
import { authChangePassword, authLogout } from 'src/app/auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { LanguageMenuComponent } from 'src/app/design-system/language-menu/language-menu.component';
import { DarkModeSwitchComponent } from './dark-mode-switch-component/dark-mode-switch.component';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';

@Component({
  selector: 'nma-header',
  standalone: true,
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    LetDirective,
    CommonModule,
    LanguageMenuComponent,
    DarkModeSwitchComponent,
    BurgerMenuComponent,
  ],
})
export class HeaderComponent {
  @Input({ required: true }) label = '';

  constructor(
    private store: Store,
    private dialog: Dialog
  ) {}

  protected onLogOut(): void {
    this.store.dispatch(authLogout());
  }

  protected onChangePassword(): void {
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
