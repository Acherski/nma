import { NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  standalone: true,
  selector: 'nma-button',
  templateUrl: 'button.component.html',
  styleUrl: 'button.component.scss',
  imports: [TranslateModule, MatIconModule, NgIf, NgStyle, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() text = '';
  @Input() buttonType: 'confirm' | 'cancel' | 'default' = 'default';
  @Input() disabled = false;
  @Input() loading = false;

  @Output() clickEvent = new EventEmitter();

  onClick(): void {
    this.clickEvent.emit();
  }
}
