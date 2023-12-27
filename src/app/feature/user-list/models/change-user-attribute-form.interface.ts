import { FormControl } from '@angular/forms';

export interface ChangeUserAttributeForm {
  attributeName: FormControl<string>;
  attributeValue: FormControl<string>;
}
