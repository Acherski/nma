import { createAction, props } from '@ngrx/store';
import { RegisterData } from '../models/register.interface';
import { AuthActionTypes } from './action-types.enum';
import { LoginData } from '../models/login-data.interface';

export const authLogin = createAction(AuthActionTypes.LOGIN, props<LoginData>());
export const authLoginSuccess = createAction(AuthActionTypes.LOGIN_SUCCESS);
export const authLoginFail = createAction(AuthActionTypes.LOGIN_FAIL, props<{ error: string }>());
export const authLogout = createAction(AuthActionTypes.LOGOUT);
export const authRegister = createAction(AuthActionTypes.REGISTER, props<RegisterData>());
export const authRegisterSuccess = createAction(AuthActionTypes.REGISTER_SUCCESS);
export const authRegisterFail = createAction(AuthActionTypes.REGISTER_FAIL, props<{ error: string }>());
export const authChangePassword = createAction(
  AuthActionTypes.CHANGE_PASSWORD,
  props<{ oldPassword?: string; newPassword: string }>()
);
export const authChangePasswordSuccess = createAction(AuthActionTypes.CHANGE_PASSWORD_SUCCESS);
export const authChangePasswordFail = createAction(AuthActionTypes.CHANGE_PASSWORD_FAIL, props<{ error: string }>());
export const authSwitchMode = createAction(AuthActionTypes.SWITCH_MODE);
export const authSwitchModeToReg = createAction(AuthActionTypes.SWITCH_MODE_REG);
export const authSwitchModeToLog = createAction(AuthActionTypes.SWITCH_MODE_LOG);
export const authSwitchModeToPassChange = createAction(AuthActionTypes.SWITCH_MODE_PASS_CHANGE);
