import { Component, HostBinding, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DarkModeService } from './shared/services/dark-mode.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'nma-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @HostBinding('class') className = '';

  constructor(
    translate: TranslateService,
    private darkModeService: DarkModeService,
    private overlay: OverlayContainer
  ) {
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');

    const language = localStorage.getItem('language') ?? translate.getBrowserLang();
    translate.use(language && language.match(/en|pl/) ? language : 'en');
  }

  ngOnInit(): void {
    const darkMode = localStorage.getItem('darkClassName');
    darkMode !== 'dark' ? (this.className = '') : (this.className = 'dark');

    this.darkModeService.darkMode$.subscribe(value => {
      this.className = value;
      if (value) {
        this.overlay.getContainerElement().classList.add('dark');
      } else {
        this.overlay.getContainerElement().classList.remove('dark');
      }
    });
  }
}
