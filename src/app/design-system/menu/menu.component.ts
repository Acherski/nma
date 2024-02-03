import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconButtonComponent } from 'src/app/design-system/icon-button/icon-button.component';
import { menuIcon } from 'src/app/shared/constants/icons.constant';
import { ClickOutsideDirective } from 'src/app/shared/utils/directives/click-outside.directive';
import { SanitizeHtmlPipe } from 'src/app/shared/utils/pipes/sanitize-html.pipe';

@Component({
  standalone: true,
  selector: 'nma-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'menu.component.html',
  imports: [NgIf, IconButtonComponent, ClickOutsideDirective, SanitizeHtmlPipe],
})
export class MenuComponent {
  @Input() icon?: string;
  @Input() textLabel?: string;

  protected menuOpen = false;
  readonly menuIcon = menuIcon;

  closeMenu() {
    this.menuOpen = false;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }
}
