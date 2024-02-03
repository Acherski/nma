import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { IconButtonComponent } from '../../icon-button/icon-button.component';
import { visibilityOffIcon, visibilityOnIcon } from 'src/app/shared/constants/icons.constant';

@Component({
  standalone: true,
  selector: 'nma-password-control',
  templateUrl: './password-control.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatInputModule,
    IconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordControlComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) control!: FormControl;

  readonly visibilityOnIcon = visibilityOnIcon;
  readonly visibilityOffIcon = visibilityOffIcon;

  protected passwordHidden = true;
}
