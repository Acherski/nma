import { FormControl } from '@angular/forms';

export interface ChangePasswordForm {
  newPassword: FormControl<string>;
  enforceChange: FormControl<boolean>;
}
