import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthForm } from '../models/auth-form-group.interface';

export const createAuthFormGroupUtil = (): FormGroup<AuthForm> => {
  return new FormGroup<AuthForm>({
    login: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    password: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    newPassword: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    newPasswordReentered: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });
};
