import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { languages } from './languages.const';
import { LanguageItem } from './language-item.interface';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  standalone: true,
  selector: 'nma-language-menu',
  templateUrl: './language-menu.component.html',
  imports: [CommonModule, MatButtonModule, MatMenuModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageMenuComponent {
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
  }
}
