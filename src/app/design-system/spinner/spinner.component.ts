import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'nma-spinner',
  templateUrl: 'spinner.component.html',
  styleUrl: 'spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}
