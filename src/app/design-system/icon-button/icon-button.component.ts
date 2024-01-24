import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nma-icon-button',
  templateUrl: 'icon-button.component.html',
  imports: [MatIconModule, TranslateModule, MatTooltipModule, NgIf],
})
export class IconButtonComponent {
  @Input({ required: true }) icon = '';
  @Input() tooltipText?: string;

  @Output() clickEvent = new EventEmitter<void>();

  onClick() {
    this.clickEvent.emit();
  }
}
