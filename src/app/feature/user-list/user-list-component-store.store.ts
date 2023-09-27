import { DestroyRef, Injectable, inject } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Observable, filter, switchMap, take, tap } from 'rxjs';
import { CallState, LoadingState } from 'src/app/shared/constants/callstate.constant';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { UserListComponentStoreData } from './models/user-list-component-store-data.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangePasswordDialogData } from './models/password-dialog-data.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { mapResponseToStringArray } from 'src/app/shared/utils/functions/map-backend-res-to-array.util';
import { UserService } from 'src/app/backend/feature-services/user.service';

@Injectable()
export class UserListComponentStore extends ComponentStore<UserListComponentStoreData> implements OnStoreInit {
  readonly callState$: Observable<CallState> = this.select(state => state.callState);
  readonly listOfUsers$: Observable<string[]> = this.select(state => state.listOfUsers);
  readonly detailsCallState$: Observable<CallState> = this.select(state => state.detailsCallState);
  readonly listOfAttributes$: Observable<Record<string, string>> = this.select(state => state.listOfAttributes);

  private userService = inject(UserService);
  private snackBarService = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    super({ callState: LoadingState.INIT, listOfUsers: [], detailsCallState: LoadingState.INIT, listOfAttributes: {} });
  }

  readonly loadUsers = this.effect(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ callState: LoadingState.LOADING })),
      switchMap(() =>
        this.userService.loadUserList().pipe(
          filter(res => res.includes('|lsu')),
          tapResponse(
            listOfUsers => {
              this.patchState({
                callState: LoadingState.LOADED,
                listOfUsers: mapResponseToStringArray(listOfUsers),
              });
            },
            (errors: HttpErrorResponse) => {
              this.patchState({ callState: { error: errors.error } });
              this.snackBarService.showErrorMessage(errors.error ?? 'USERS.LOAD_LIST_ERROR');
            }
          )
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  readonly removeUser = this.effect((trigger$: Observable<{ userName: string }>) =>
    trigger$.pipe(
      tap(() => this.patchState({ callState: LoadingState.LOADING })),
      switchMap(({ userName }) =>
        this.userService.removeUser(userName).pipe(
          tapResponse(
            () => {
              this.patchState({ callState: LoadingState.LOADED });
              this.snackBarService.showSuccessMessage('USERS.REMOVE_SUCCESS');
              this.loadUsers();
            },
            (errors: HttpErrorResponse) => {
              this.patchState({ callState: { error: errors.error } });
              this.snackBarService.showErrorMessage(errors.error ?? 'USERS.REMOVE_ERROR');
            }
          )
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  readonly changePassword = this.effect((trigger$: Observable<ChangePasswordDialogData>) =>
    trigger$.pipe(
      tap(() => this.patchState({ callState: LoadingState.LOADING })),
      switchMap(({ userName, newPassword, enforceChange }) =>
        this.userService.changePasswordAdminMode(userName, newPassword, enforceChange).pipe(
          tapResponse(
            () => {
              this.patchState({ callState: LoadingState.LOADED });
              this.snackBarService.showSuccessMessage('USERS.CHANGE_PASSWORD_SUCCESS');
              this.loadUsers();
            },
            (errors: HttpErrorResponse) => {
              this.patchState({ callState: { error: errors.error } });
              this.snackBarService.showErrorMessage(errors.error ?? 'USERS.CHANGE_PASSWORD_ERROR');
            }
          )
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  readonly loadUserAttributes = this.effect<string>(trigger$ =>
    trigger$.pipe(
      tap(userName => {
        this.userService.loadUserAttributeKeys(userName);
        this.patchState({ detailsCallState: LoadingState.LOADING });
      }),
      switchMap(userName =>
        this.userService.webSocket$.pipe(
          filter(res => res.includes('|lua')),
          tapResponse(
            attributes => {
              this.patchState({
                listOfAttributes: Object.fromEntries(mapResponseToStringArray(attributes).map(value => [value, ''])),
              });

              this.userService
                .loadUserAttributeValues(userName, attributes)
                .pipe(
                  take(1),
                  tap(res => {
                    this.patchState({
                      detailsCallState: LoadingState.LOADED,
                      listOfAttributes: Object.fromEntries(
                        mapResponseToStringArray(attributes).map((value, index) => [
                          value,
                          mapResponseToStringArray(res)[index],
                        ])
                      ),
                    });
                  })
                )
                .subscribe();
            },
            (errors: HttpErrorResponse) => {
              this.patchState({ detailsCallState: { error: errors.error } });
            }
          )
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  ngrxOnStoreInit() {
    this.loadUsers();
  }
}
