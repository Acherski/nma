import { CallState } from 'src/app/shared/constants/callstate.constant';
import { AuthModeEnum } from '../enums/auth-mode.enum';

export interface AuthState {
  callState: CallState;
  authMode: AuthModeEnum;
}
