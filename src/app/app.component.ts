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

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang && browserLang.match(/en|pl/) ? browserLang : 'en');
  }
}
