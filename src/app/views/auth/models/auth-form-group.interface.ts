import { FormControl } from '@angular/forms';

export interface AuthForm {
  login: FormControl<string>;
  password: FormControl<string>;
  email: FormControl<string>;
  newPassword: FormControl<string>;
  newPasswordReentered: FormControl<string>;
}
