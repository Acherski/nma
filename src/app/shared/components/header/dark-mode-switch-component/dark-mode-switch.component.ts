import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { DarkModeService } from 'src/app/shared/services/dark-mode.service';

@Component({
  standalone: true,
  selector: 'nma-dark-mode-switch',
  templateUrl: 'dark-mode-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, MatIconModule, MatTooltipModule, ReactiveFormsModule],
})
export class DarkModeSwitchComponent implements OnInit {
  darkModeControl = new FormControl(false);

  private destroyRef = inject(DestroyRef);
  private darkModeService = inject(DarkModeService);

  ngOnInit(): void {
    const darkMode = localStorage.getItem('darkClassName');
    if (darkMode) {
      this.darkModeService.setMode(darkMode);
      this.darkModeControl.setValue(true);
    }

    this.darkModeControl.valueChanges
      .pipe(
        tap(darkMode => {
          if (darkMode) {
            localStorage.setItem('darkClassName', 'dark');
            this.darkModeService.setMode('dark');
          } else {
            localStorage.setItem('darkClassName', '');
            this.darkModeService.setMode('');
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  toggleDarkMode() {
    this.darkModeControl.setValue(!this.darkModeControl.value);
  }
}
