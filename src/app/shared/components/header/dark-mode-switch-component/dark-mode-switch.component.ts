import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { IconButtonComponent } from 'src/app/design-system/icon-button/icon-button.component';
import { DarkModeService } from 'src/app/shared/services/dark-mode.service';

@Component({
  standalone: true,
  selector: 'nma-dark-mode-switch',
  templateUrl: 'dark-mode-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconButtonComponent],
})
export class DarkModeSwitchComponent implements OnInit {
  darkModeControl = new FormControl(false);
  icon = this.darkModeControl.value ? 'light_mode' : 'dark_mode';

  private destroyRef = inject(DestroyRef);
  private darkModeService = inject(DarkModeService);

  ngOnInit(): void {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) {
      this.darkModeService.setMode(true);
      this.darkModeControl.setValue(true);
    }

    this.darkModeControl.valueChanges
      .pipe(
        tap(darkMode => {
          if (darkMode) {
            localStorage.setItem('darkMode', 'true');
            this.darkModeService.setMode(true);
          } else {
            localStorage.removeItem('darkMode');
            this.darkModeService.setMode(false);
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
