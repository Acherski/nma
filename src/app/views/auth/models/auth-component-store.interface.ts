import { CallState } from 'src/app/constants/callstate.constant';

export type AuthMode = 'REGISTER' | 'LOGIN' | 'PASSWORD_CHANGE';

export interface AuthComponentStoreData {
  callState: CallState;
  authMode: AuthMode;
}
