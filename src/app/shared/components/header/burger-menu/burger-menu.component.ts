import { Dialog } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { authChangePassword, authLogout } from 'src/app/auth/store/auth.actions';
import { IconButtonComponent } from 'src/app/design-system/icon-button/icon-button.component';
import { ChangeOwnPasswordDialogComponent } from '../change-own-password-dialog/change-own-password-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { DarkModeSwitchComponent } from '../dark-mode-switch-component/dark-mode-switch.component';
import { LanguageMenuComponent } from 'src/app/shared/components/header/language-menu/language-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ClickOutsideDirective } from 'src/app/shared/utils/directives/click-outside.directive';
import { MenuComponent } from 'src/app/design-system/menu/menu.component';

@Component({
  standalone: true,
  selector: 'nma-burger-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'burger-menu.component.html',
  imports: [
    NgIf,
    IconButtonComponent,
    DarkModeSwitchComponent,
    LanguageMenuComponent,
    TranslateModule,
    MatIconModule,
    ClickOutsideDirective,
    MenuComponent,
  ],
})
export class BurgerMenuComponent implements OnInit {
  protected userName = '';

  constructor(
    private store: Store,
    private dialog: Dialog,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUserName();
    if (user) this.userName = user;
  }

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
