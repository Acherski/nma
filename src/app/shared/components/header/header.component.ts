import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DarkModeService } from '../../services/dark-mode.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nma-header',
  standalone: true,
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    TranslateModule,
    LetDirective,
    CommonModule,
    MatMenuModule,
    LanguageMenuComponent,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class HeaderComponent implements OnInit {
  @Input({ required: true }) label = '';

  darkModeControl = new FormControl(false);

  constructor(
    private store: Store,
    private dialog: Dialog,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    const darkMode = localStorage.getItem('darkClassName');
    if (darkMode) {
      this.darkModeService.setMode(darkMode);
      this.darkModeControl.setValue(true);
    }

    this.darkModeControl.valueChanges.subscribe(darkMode => {
      if (darkMode) {
        localStorage.setItem('darkClassName', 'dark');
        this.darkModeService.setMode('dark');
      } else {
        localStorage.setItem('darkClassName', '');
        this.darkModeService.setMode('');
      }
    });
  }

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
