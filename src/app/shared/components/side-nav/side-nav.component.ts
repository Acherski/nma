import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type SideNavLink = {
  icon: string;
  url: string;
  tooltipText: string;
};

@Component({
  standalone: true,
  selector: 'nma-side-nav',
  templateUrl: './side-nav.component.html',
  imports: [CommonModule, RouterModule, MatTooltipModule, MatIconModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  protected links: SideNavLink[] = [
    { url: 'users', icon: 'people', tooltipText: 'SIDE_NAV.USERS' },
    { url: 'server-settings', icon: 'computer', tooltipText: 'SIDE_NAV.SERVER_SETTINGS' },
  ];
}
