import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'nma-text-control',
  templateUrl: './text-control.component.html',
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, TranslateModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextControlComponent implements OnInit {
  @Input({ required: true }) label = '';
  @Input({ required: true }) control!: FormControl;
  @Input() controlDisabled = false;

  ngOnInit(): void {
    if (this.controlDisabled) {
      this.control.disable();
    }
  }
}
