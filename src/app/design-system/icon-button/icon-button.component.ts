import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'nma-icon-button',
  templateUrl: 'icon-button.component.html',
  imports: [MatIconModule, TranslateModule, MatTooltipModule, NgIf],
})
export class IconButtonComponent implements OnInit {
  @Input({ required: true }) icon = '';
  @Input() tooltipText = '';
  @Input() customTailwindClasses?: string;
  @Output() clickEvent = new EventEmitter<void>();

  iconStyles = 'hover:scale-125 dark:text-gray-200 text-primary-300';

  ngOnInit(): void {
    this.iconStyles = `${this.iconStyles} ${this.customTailwindClasses}`;
  }

  onClick(event: Event): void {
    event.stopPropagation();
    this.clickEvent.emit();
  }
}
