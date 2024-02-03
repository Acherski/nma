import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconButtonComponent } from 'src/app/design-system/icon-button/icon-button.component';
import { MatIconModule } from '@angular/material/icon';
import { ClickOutsideDirective } from 'src/app/shared/utils/directives/click-outside.directive';

@Component({
  standalone: true,
  selector: 'nma-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'menu.component.html',
  imports: [NgIf, IconButtonComponent, MatIconModule, ClickOutsideDirective],
})
export class MenuComponent {
  @Input() icon?: string;
  @Input() textLabel?: string;

  protected menuOpen = false;

  closeMenu() {
    this.menuOpen = false;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }
}
