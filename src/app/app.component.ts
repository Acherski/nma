import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'nma-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');

    const language = localStorage.getItem('language') ?? translate.getBrowserLang();
    translate.use(language && language.match(/en|pl/) ? language : 'en');
  }
}
