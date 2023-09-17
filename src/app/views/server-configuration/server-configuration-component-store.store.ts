import { DestroyRef, Injectable, inject } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { CallState, LoadingState } from 'src/app/constants/callstate.constant';
import { ServerSetting } from './models/server-setting.interface';
import { ServerConfigurationComponentStoreData } from './models/server-configuration-component-store-data.interface';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { WebsocketService } from 'src/app/backend/websocket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ServerConfigurationComponentStore
  extends ComponentStore<ServerConfigurationComponentStoreData>
  implements OnStoreInit
{
  readonly callState$: Observable<CallState> = this.select(state => state.callState);
  readonly settingList$: Observable<ServerSetting[]> = this.select(state => state.settingList);

  private websocketService = inject(WebsocketService);
  private snackBarService = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    super({ callState: LoadingState.INIT, settingList: [] });
  }

  readonly loadSettings = this.effect(trigger$ =>
    trigger$.pipe(
      tap(() => {
        this.websocketService.sendMessage(`R|${this.websocketService.getAndSetIndex()}|LSU`);
        this.patchState({ callState: LoadingState.LOADING });
      }),
      switchMap(() =>
        this.websocketService.webSocket$.pipe(
          filter(res => res.includes('|lsu')),
          tapResponse(
            () => {
              const settingList: ServerSetting[] = [];

              this.patchState({ callState: LoadingState.LOADED, settingList });
            },
            (errors: HttpErrorResponse) => {
              this.patchState({ callState: { error: errors.error } });
              this.snackBarService.showErrorMessage(errors.error ?? 'SERVER_CONFIGURATION.LOAD_ERROR');
            }
          )
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  readonly editSetting = this.effect((trigger$: Observable<ServerSetting>) =>
    trigger$.pipe(
      tap(() => this.patchState({ callState: LoadingState.LOADING })),
      switchMap(({ settingKey, settingValue }) =>
        this.websocketService
          .sendMessage(`R|${this.websocketService.getAndSetIndex()}|RMU|${settingKey}|${settingValue}`)
          .pipe(
            tapResponse(
              () => {
                this.patchState({ callState: LoadingState.LOADED });
                this.snackBarService.showSuccessMessage('SERVER_CONFIGURATION.SETTING_EDIT_SUCCESS');
                this.loadSettings();
              },
              (errors: HttpErrorResponse) => {
                this.patchState({ callState: { error: errors.error } });
                this.snackBarService.showErrorMessage(errors.error ?? 'SERVER_CONFIGURATION.SETTING_EDIT_FAIL');
              }
            )
          )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  ngrxOnStoreInit() {
    this.loadSettings();
  }
}
