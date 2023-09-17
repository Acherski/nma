import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ServerConfigurationComponent } from '../server-configuration/server-configuration.component';
import { provideComponentStore } from '@ngrx/component-store';
import { UserListComponentStore } from './user-list-component-store.store';
import { LetDirective } from '@ngrx/component';
import { SpinnerComponent } from 'src/app/design-system/spinner/spinner.component';
import { SideNavComponent } from 'src/app/shared/components/side-nav/side-nav.component';
import { DeleteUserDialogComponent } from './dialogs/delete-user-dialog/delete-user-dialog.component';
import { ChangePasswordDialogComponent } from './dialogs/change-password-dialog/change-password-dialog.component';
import { ChangePasswordDialogData } from './dialogs/change-password-dialog/password-dialog-data.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter, tap } from 'rxjs';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { LoadingState } from 'src/app/constants/callstate.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorService } from 'src/app/services/page-config.service';

@Component({
  selector: 'nma-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    HeaderComponent,
    TranslateModule,
    MatButtonModule,
    DialogModule,
    ServerConfigurationComponent,
    LetDirective,
    SpinnerComponent,
    SideNavComponent,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    CdkAccordionModule,
    MatPaginatorModule,
  ],
  providers: [provideComponentStore(UserListComponentStore)],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['no', 'userName', 'actions'];
  expandedElement: string | null = null;
  listOfUsers: string[] = [];
  dataSource!: MatTableDataSource<string>;

  readonly LoadingState = LoadingState;

  private destroyRef = inject(DestroyRef);

  constructor(
    protected componentStore: UserListComponentStore,
    private paginatorService: PaginatorService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.componentStore.listOfUsers$
      .pipe(
        tap(list => {
          this.listOfUsers = [];
          list.map(user => this.listOfUsers.push(user));
          this.dataSource = new MatTableDataSource(this.listOfUsers);
          if (this.paginator) this.dataSource.paginator = this.paginatorService.translatePaginator(this.paginator);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onUserDelete(userName: string, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open<string>(DeleteUserDialogComponent, {
      width: '350px',
      data: { userName },
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.componentStore.removeUser({ userName });
      }
    });
  }

  protected onPasswordChange(userName: string, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open<ChangePasswordDialogData>(ChangePasswordDialogComponent, {
      width: '350px',
      data: { userName },
    });

    dialogRef.closed.subscribe(result => {
      if (result)
        this.componentStore.changePassword({
          userName: result.userName,
          newPassword: result.newPassword,
          enforceChange: result.enforceChange,
        });
    });
  }

  loadUserAttributes(row: string) {
    if (row === this.expandedElement) {
      this.expandedElement = null;
      return;
    }

    this.componentStore.loadUserAttributes(row);
    this.componentStore.detailsCallState$
      .pipe(
        filter(callState => callState === LoadingState.LOADED),
        tap(() => {
          this.expandedElement = row;
        })
      )
      .subscribe();
  }
}
