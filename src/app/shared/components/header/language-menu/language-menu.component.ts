import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { languages } from './languages.const';
import { LanguageItem } from './language-item.interface';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MenuComponent } from 'src/app/design-system/menu/menu.component';

@Component({
  standalone: true,
  selector: 'nma-language-menu',
  templateUrl: './language-menu.component.html',
  imports: [CommonModule, MatButtonModule, TranslateModule, MenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageMenuComponent {
  @ViewChild('menu') menuComponent: MenuComponent | undefined;

  protected languages = languages;

  constructor(
    private translateService: TranslateService,
    private storageService: StorageService
  ) {}

  protected get currentLanguage(): string {
    return this.translateService.currentLang;
  }

  protected setLanguage(value: LanguageItem): void {
    this.storageService.setLanguage(value.shortName);
    this.translateService.use(value.shortName);
    if (this.menuComponent) {
      this.menuComponent.closeMenu();
    }
  }
}
