import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthForm } from '../models/auth-form-group.interface';
import { requiredNonNullable } from 'src/app/shared/constants/required-nonnullable.constant';

export const createAuthFormGroupUtil = (): FormGroup<AuthForm> => {
  return new FormGroup<AuthForm>({
    login: new FormControl<string>('', requiredNonNullable),
    password: new FormControl<string>('', requiredNonNullable),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    newPassword: new FormControl<string>('', requiredNonNullable),
    newPasswordReentered: new FormControl<string>('', requiredNonNullable),
  });
};
