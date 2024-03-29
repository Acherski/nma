import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SanitizeHtmlPipe } from 'src/app/shared/utils/pipes/sanitize-html.pipe';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'nma-icon-button',
  templateUrl: 'icon-button.component.html',
  imports: [TranslateModule, MatTooltipModule, NgIf, SanitizeHtmlPipe],
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
