import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'nma-text-control',
  templateUrl: './text-control.component.html',
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, TranslateModule, MatInputModule],
})
export class TextControlComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) control!: FormControl;
}
