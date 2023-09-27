import { DestroyRef, Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, forkJoin, of, switchMap, take, tap } from 'rxjs';
import {
  authChangePasswordFail,
  authChangePasswordSuccess,
  authLoginFail,
  authLoginSuccess,
  authRegisterFail,
  authRegisterSuccess,
  authSwitchModeToLog,
  authSwitchModeToPassChange,
  authSwitchModeToReg,
} from './auth.actions';
import { tapResponse } from '@ngrx/component-store';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthModeEnum } from '../enums/auth-mode.enum';
import { selectAuthMode } from './auth.selectors';
import { AuthActionTypes } from './action-types.enum';
import { WebsocketService } from 'src/app/backend/websocket.service';
import { RegisterData } from '../models/register.interface';
import { WebSocketEventsEnum } from 'src/app/backend/enums/websocket-events.enum';
import { LoginData } from '../models/login-data.interface';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private websocketService: WebsocketService,
    private storageService: StorageService,
    private store: Store,
    private router: Router
  ) {}

  private snackBarService = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LOGIN),
        switchMap((loginData: LoginData) => forkJoin([this.websocketService.connect().pipe(take(1)), of(loginData)])),
        switchMap(([connectResponse, { login, password }]) => {
          if (connectResponse === WebSocketEventsEnum.CONNECTED) {
            this.websocketService
              .login(login, password)
              .pipe(
                take(1),
                tap(loginResponse => {
                  const loggedIn = +loginResponse.split('|')[4];

                  if (!loggedIn) {
                    this.store.dispatch(authLoginFail({ error: 'error' }));
                    this.snackBarService.showErrorMessage('AUTH.LOGIN_FAILED');
                    this.websocketService.close();
                  } else if (loggedIn === 1) {
                    const sessionToken = loginResponse.split('|')[5];
                    this.storageService.setSessionToken(sessionToken);
                    this.store.dispatch(authLoginSuccess());
                    this.snackBarService.showSuccessMessage('AUTH.LOGIN_SUCCESS');
                    this.router.navigate(['']);
                  } else if (loggedIn === 2) {
                    this.store.dispatch(authSwitchModeToPassChange());
                    this.snackBarService.showInfoMessage('AUTH.PASSWORD_CHANGE_NEEDED');
                  }
                })
              )
              .subscribe();
          } else {
            this.snackBarService.showErrorMessage('AUTH.CONNECTION_FAILED');
          }
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.REGISTER),
        switchMap((registerData: RegisterData) =>
          forkJoin([this.websocketService.connect().pipe(take(1)), of(registerData)])
        ),
        switchMap(([connectResponse, { login, password, email }]) => {
          if (connectResponse === WebSocketEventsEnum.CONNECTED) {
            this.websocketService
              .register(login, password, email)
              .pipe(
                take(1),
                tapResponse(
                  () => {
                    this.snackBarService.showSuccessMessage('AUTH.REGISTER_SUCCESS');
                    this.store.dispatch(authRegisterSuccess());
                  },
                  (errors: HttpErrorResponse) => {
                    this.snackBarService.showErrorMessage(errors.error);
                    this.store.dispatch(authRegisterFail(errors.error));
                  }
                )
              )
              .subscribe();
          } else {
            this.snackBarService.showErrorMessage('AUTH.CONNECTION_FAILED');
          }
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  changePassword$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.CHANGE_PASSWORD),
        switchMap(({ oldPassword, newPassword }) =>
          this.websocketService.changePassword(newPassword, oldPassword).pipe(
            tapResponse(
              () => {
                this.store.dispatch(authChangePasswordSuccess());
                this.snackBarService.showSuccessMessage('AUTH.CHANGE_PASSWORD_SUCCESS');
              },
              (errors: HttpErrorResponse) => {
                this.store.dispatch(authChangePasswordFail(errors.error));
                this.snackBarService.showErrorMessage(errors.error ?? 'AUTH.CHANGE_PASSWORD_ERROR');
              }
            )
          )
        )
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LOGOUT),
        tap(() => {
          this.websocketService.disconnect();
          this.snackBarService.showSuccessMessage('AUTH.LOGOUT_SUCCESS');
        }),
        takeUntilDestroyed(this.destroyRef)
      ),
    { dispatch: false }
  );

  switchMode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.SWITCH_MODE),
        switchMap(() =>
          this.store.select(selectAuthMode).pipe(
            take(1),
            switchMap(mode => {
              if (mode === AuthModeEnum.LOGIN) {
                this.store.dispatch(authSwitchModeToReg());
              } else {
                this.store.dispatch(authSwitchModeToLog());
              }
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );
}
