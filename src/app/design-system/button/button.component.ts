import { NgClass, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SanitizeHtmlPipe } from 'src/app/shared/utils/pipes/sanitize-html.pipe';

@Component({
  standalone: true,
  selector: 'nma-button',
  templateUrl: 'button.component.html',
  styleUrl: 'button.component.scss',
  imports: [TranslateModule, NgIf, NgStyle, NgClass, SpinnerComponent, SanitizeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input({ required: true }) text = '';
  @Input() buttonMode: 'confirm' | 'cancel' | 'default' = 'default';
  @Input() buttonType: 'submit' | 'button' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;

  @Output() clickEvent = new EventEmitter();
}
