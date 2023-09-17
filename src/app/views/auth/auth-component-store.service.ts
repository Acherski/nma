import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { CallState, LoadingState } from '../../constants/callstate.constant';
import { Observable, switchMap, take, tap } from 'rxjs';
import { WebsocketService } from '../../backend/websocket.service';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterData } from './models/register.interface';
import { SnackBarService } from '../../services/snackbar.service';
import { AuthComponentStoreData, AuthMode } from './models/auth-component-store.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Injectable()
export class AuthComponentStore extends ComponentStore<AuthComponentStoreData> {
  readonly callState$: Observable<CallState> = this.select(state => state.callState);
  readonly authMode$: Observable<AuthMode> = this.select(state => state.authMode);

  private router = inject(Router);
  private snackBarService = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);
  private storageService = inject(StorageService);

  constructor(private websocketService: WebsocketService) {
    super({ callState: LoadingState.INIT, authMode: 'LOGIN' });
  }

  public get isLoggedIn() {
    return this.storageService.get('loggedIn');
  }

  // napisac poprawnie ponizsze logowanie!!! rozdzielic connect od login, itd.
  readonly login = this.effect((trigger$: Observable<{ login: string; password: string }>) =>
    trigger$.pipe(
      tap(() => this.patchState({ callState: LoadingState.LOADING })),
      switchMap(({ login, password }) =>
        this.websocketService.connect().pipe(
          tapResponse(
            (response: string) => {
              if (response === 'connected')
                this.websocketService.sendMessage(
                  `R|${this.websocketService.getAndSetIndex()}|LOG|${login}|${password}`
                );

              this.patchState({ callState: LoadingState.LOADED });
              const responseArray = response.split('|');
              const isLoggedIn = responseArray[responseArray.length - 2] === '1';
              const isNotLoggedIn = responseArray[responseArray.length - 2] === '0';
              const passwordChangeNeeded = responseArray[responseArray.length - 2] === '2';

              if (isLoggedIn) {
                this.snackBarService.showSuccessMessage('AUTH.LOGIN_SUCCESS');
                this.storageService.set('loggedIn', 'true');
                this.router.navigate(['']);
              } else if (isNotLoggedIn) {
                this.websocketService.disconnect();
                this.snackBarService.showErrorMessage('AUTH.LOGIN_FAILED');
              } else if (passwordChangeNeeded) {
                this.patchState({ callState: LoadingState.LOADED, authMode: 'PASSWORD_CHANGE' });
                this.snackBarService.showInfoMessage('AUTH.PASSWORD_CHANGE_NEEDED');
              }
            },
            (errors: HttpErrorResponse) => {
              this.patchState({ callState: { error: errors.error } });
              this.snackBarService.showErrorMessage(errors.error ?? 'AUTH.CONNECTION_FAILED');
            }
          )
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  readonly register = this.effect((trigger$: Observable<RegisterData>) =>
    trigger$.pipe(
      tap(() => this.patchState({ callState: LoadingState.LOADING })),
      switchMap(({ login, password, email }) =>
        this.websocketService.connect().pipe(
          tapResponse(
            (response: string) => {
              this.websocketService.sendMessage(
                `R|${this.websocketService.getAndSetIndex()}|REG|${login}|${password}|${email}`
              );
              this.patchState({ callState: LoadingState.LOADED });
              const responseArray = response.split('|');
              if (!response.includes('r|0|0|reg')) return;

              const registeredSuccessfully = responseArray[4] === '1';

              if (registeredSuccessfully) {
                this.snackBarService.showSuccessMessage('AUTH.REGISTER_SUCCESS');
                this.patchState({ authMode: 'LOGIN' });
              } else {
                this.snackBarService.showErrorMessage(responseArray[5]);
              }
            },
            (errors: HttpErrorResponse) => {
              this.patchState({ callState: { error: errors.error } });
              this.snackBarService.showErrorMessage(errors.error ?? 'AUTH.CONNECTION_FAILED');
            }
          )
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  readonly changeYourOwnPassword = this.effect((trigger$: Observable<{ oldPassword?: string; newPassword: string }>) =>
    trigger$.pipe(
      tap(() => this.patchState({ callState: LoadingState.LOADING })),
      switchMap(({ oldPassword, newPassword }) =>
        this.websocketService
          .sendMessage(`R|${this.websocketService.getAndSetIndex()}|PWD|${oldPassword ?? ''}|${newPassword}`)
          .pipe(
            tapResponse(
              () => {
                this.patchState({ callState: LoadingState.LOADED, authMode: 'LOGIN' });
                this.snackBarService.showSuccessMessage('AUTH.CHANGE_PASSWORD_SUCCESS');
              },
              (errors: HttpErrorResponse) => {
                this.patchState({ callState: { error: errors.error } });
                this.snackBarService.showErrorMessage(errors.error ?? 'AUTH.CHANGE_PASSWORD_ERROR');
              }
            )
          )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  readonly logout = this.effect(trigger$ =>
    trigger$.pipe(
      tap(() => {
        this.snackBarService.showSuccessMessage('AUTH.LOGOUT_SUCCESS');
        this.websocketService.disconnect();
        this.storageService.remove('loggedIn');
        this.router.navigate(['login']);
      }),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  switchMode() {
    this.authMode$
      .pipe(
        take(1),
        tap(mode => {
          if (mode === 'LOGIN') {
            this.patchState({ authMode: 'REGISTER' });
          } else {
            this.patchState({ authMode: 'LOGIN' });
          }
        })
      )
      .subscribe();
  }
}
