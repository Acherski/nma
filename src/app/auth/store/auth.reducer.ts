import { LoadingState } from 'src/app/shared/constants/callstate.constant';
import { createReducer, on } from '@ngrx/store';
import { AuthModeEnum } from '../enums/auth-mode.enum';
import {
  authChangePassword,
  authChangePasswordFail,
  authChangePasswordSuccess,
  authLogin,
  authLoginFail,
  authLoginSuccess,
  authRegister,
  authRegisterFail,
  authRegisterSuccess,
  authSwitchModeToLog,
  authSwitchModeToPassChange,
  authSwitchModeToReg,
} from './auth.actions';
import { AuthState } from './auth.model';

export const initialState: AuthState = {
  callState: LoadingState.INIT,
  authMode: AuthModeEnum.LOGIN,
};

export const authReducer = createReducer(
  initialState,
  on(authLogin, state => ({
    ...state,
    callState: LoadingState.LOADING,
  })),
  on(authLoginSuccess, state => ({
    ...state,
    callState: LoadingState.LOADED,
  })),
  on(authLoginFail, state => ({
    ...state,
    callState: { error: 'error' },
  })),
  on(authRegister, state => ({
    ...state,
    callState: LoadingState.LOADING,
  })),
  on(authRegisterSuccess, state => ({
    ...state,
    callState: LoadingState.LOADED,
    authMode: AuthModeEnum.LOGIN,
  })),
  on(authRegisterFail, state => ({
    ...state,
    callState: { error: 'error' },
  })),
  on(authChangePassword, state => ({
    ...state,
    callState: LoadingState.LOADING,
  })),
  on(authChangePasswordSuccess, state => ({
    ...state,
    callState: LoadingState.LOADED,
    authMode: AuthModeEnum.LOGIN,
  })),
  on(authChangePasswordFail, state => ({
    ...state,
    callState: { error: 'error' },
  })),
  on(authSwitchModeToReg, state => ({
    ...state,
    authMode: AuthModeEnum.REGISTER,
  })),
  on(authSwitchModeToLog, state => ({
    ...state,
    authMode: AuthModeEnum.LOGIN,
  })),
  on(authSwitchModeToPassChange, state => ({
    ...state,
    callState: LoadingState.LOADED,
    authMode: AuthModeEnum.PASSWORD_CHANGE,
  }))
);
