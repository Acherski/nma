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
import { filter, take, tap } from 'rxjs';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { LoadingState } from 'src/app/constants/callstate.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorService } from 'src/app/services/page-config.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { User } from './models/user.interface';

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
    MatSortModule,
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
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected displayedColumns: string[] = ['no', 'userName', 'actions'];
  protected expandedElement: User | null = null;
  protected listOfUsers: User[] = [];
  protected dataSource!: MatTableDataSource<User>;
  private destroyRef = inject(DestroyRef);

  readonly LoadingState = LoadingState;

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
          list.map(user => this.listOfUsers.push({ userName: user }));
          this.dataSource = new MatTableDataSource(this.listOfUsers);
          if (this.paginator && this.sort) {
            this.dataSource.paginator = this.paginatorService.translatePaginator(this.paginator);
            this.dataSource.sort = this.sort;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onUserDelete(user: User, event: Event) {
    event.stopPropagation();

    const dialogRef = this.dialog.open<User>(DeleteUserDialogComponent, {
      width: '350px',
      data: { userName: user.userName },
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.componentStore.removeUser({ userName: user.userName });
      }
    });
  }

  protected onPasswordChange(user: User, event: Event) {
    event.stopPropagation();

    const dialogRef = this.dialog.open<ChangePasswordDialogData>(ChangePasswordDialogComponent, {
      width: '350px',
      data: { userName: user.userName },
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

  protected loadUserAttributes(row: User) {
    if (row === this.expandedElement) {
      this.expandedElement = null;
      return;
    }

    this.componentStore.loadUserAttributes(row.userName);
    this.componentStore.detailsCallState$
      .pipe(
        filter(callState => callState === LoadingState.LOADED),
        take(1),
        tap(() => {
          this.expandedElement = row;
        })
      )
      .subscribe();
  }

  protected onSort() {
    this.expandedElement = null;
    this.componentStore.loadUsers();
  }
}
