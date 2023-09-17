import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'nma-checkbox-control',
  templateUrl: './checkbox-control.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatInputModule,
    MatCheckboxModule,
  ],
})
export class CheckboxControlComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) control!: FormControl;
  @Input() hint?: string;
}
