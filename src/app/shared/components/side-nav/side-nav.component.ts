import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { settingsIcon, usersIcon } from '../../constants/icons.constant';
import { SanitizeHtmlPipe } from '../../utils/pipes/sanitize-html.pipe';

type SideNavLink = {
  icon: string;
  url: string;
  label: string;
};

@Component({
  standalone: true,
  selector: 'nma-side-nav',
  templateUrl: './side-nav.component.html',
  imports: [CommonModule, RouterModule, MatTooltipModule, TranslateModule, SanitizeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  protected links: SideNavLink[] = [
    { url: 'users', icon: usersIcon, label: 'SIDE_NAV.USERS' },
    { url: 'server-settings', icon: settingsIcon, label: 'SIDE_NAV.SERVER_SETTINGS' },
  ];
}
