import { Component, DestroyRef, HostBinding, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DarkModeService } from './shared/services/dark-mode.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'nma-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @HostBinding('class') className = '';

  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);
  private darkModeService = inject(DarkModeService);
  private overlay = inject(OverlayContainer);

  constructor() {
    this.translate.addLangs(['en', 'pl']);
    this.translate.setDefaultLang('en');

    const language = localStorage.getItem('language') ?? this.translate.getBrowserLang();
    this.translate.use(language && language.match(/en|pl/) ? language : 'en');
  }

  ngOnInit(): void {
    this.darkModeService.darkMode$
      .pipe(
        tap(value => {
          if (value) {
            this.className = 'dark';
            this.overlay.getContainerElement().classList.add('dark');
          } else {
            this.className = '';
            this.overlay.getContainerElement().classList.remove('dark');
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) {
      this.darkModeService.setMode(true);
    }
  }
}
