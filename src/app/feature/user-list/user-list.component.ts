import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { provideComponentStore } from '@ngrx/component-store';
import { UserListComponentStore } from './user-list-component-store.store';
import { LetDirective } from '@ngrx/component';
import { SpinnerComponent } from 'src/app/design-system/spinner/spinner.component';
import { SideNavComponent } from 'src/app/shared/components/side-nav/side-nav.component';
import { DeleteUserDialogComponent } from './dialogs/delete-user-dialog/delete-user-dialog.component';
import { ChangePasswordDialogComponent } from './dialogs/change-password-dialog/change-password-dialog.component';
import { ChangePasswordDialogData } from '../../feature/user-list/models/password-dialog-data.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter, take, tap } from 'rxjs';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { LoadingState } from 'src/app/shared/constants/callstate.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorService } from 'src/app/shared/services/page-config.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { User } from '../../feature/user-list/models/user.interface';
import { UserService } from 'src/app/backend/feature-services/user.service';
import { DeleteAttributeDialogComponent } from './dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { UserAttributeDialogComponent } from './dialogs/user-attribute-dialog/user-attribute-dialog.component';
import { IconButtonComponent } from 'src/app/design-system/icon-button/icon-button.component';
import { ButtonComponent } from 'src/app/design-system/button/button.component';
import { addIcon, binIcon, editIcon, passwordIcon } from 'src/app/shared/constants/icons.constant';

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
    DialogModule,
    LetDirective,
    SpinnerComponent,
    SideNavComponent,
    MatTableModule,
    CdkAccordionModule,
    MatPaginatorModule,
    MatSortModule,
    IconButtonComponent,
    ButtonComponent,
  ],
  providers: [provideComponentStore(UserListComponentStore), UserService],
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
  protected hoveredAttributeId: number | null = null;
  protected expandedElement: User | null = null;
  protected listOfUsers: User[] = [];
  protected dataSource!: MatTableDataSource<User>;
  protected pageSizeOptions = [5, 10, 30, 100];
  protected componentStore = inject(UserListComponentStore);

  private paginatorService = inject(PaginatorService);
  private translateService = inject(TranslateService);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  readonly LoadingState = LoadingState;
  readonly passwordIcon = passwordIcon;
  readonly binIcon = binIcon;
  readonly editIcon = editIcon;
  readonly addIcon = addIcon;

  ngOnInit(): void {
    this.setPaginatorAndSort();
    this.updatePaginatorTranslations();
  }

  onUserDelete(user: User): void {
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

  openAttributeDialog(userName: string, attributeName?: string, attributeValue?: string): void {
    const dialogRef = this.dialog.open<{ userName: string; attributeName: string; attributeValue: string }>(
      UserAttributeDialogComponent,
      {
        width: '350px',
        data: { userName, attributeName, attributeValue },
      }
    );

    dialogRef.closed.subscribe(result => {
      if (result && result.attributeName && result.attributeValue) {
        this.componentStore.setAttribute({
          userName,
          attributeName: result.attributeName,
          attributeValue: result.attributeValue,
        });
      }
    });
  }

  onAttributeDelete(userName: string, attribute: string): void {
    const dialogRef = this.dialog.open<{ userName: string; attribute: string }>(DeleteAttributeDialogComponent, {
      width: '350px',
      data: { userName, attribute },
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.componentStore.deleteAttribute({ userName, attribute });
      }
    });
  }

  onPasswordChange(user: User): void {
    const dialogRef = this.dialog.open<ChangePasswordDialogData>(ChangePasswordDialogComponent, {
      width: '350px',
      data: { userName: user.userName },
    });

    dialogRef.closed.subscribe(result => {
      if (result?.newPassword)
        this.componentStore.changePassword({
          userName: result.userName,
          newPassword: result.newPassword,
          enforceChange: result.enforceChange,
        });
    });
  }

  toggleAttributes(row: User): void {
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

  onSort(): void {
    this.expandedElement = null;
    this.componentStore.loadUsers();
  }

  private setPaginatorAndSort(): void {
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

  // TODO paginator doesn't react to language change without function below
  private updatePaginatorTranslations(): void {
    this.translateService.onLangChange.subscribe(() => {
      this.paginator.pageSizeOptions = this.pageSizeOptions;

      const matPaginator = this.paginator;
      matPaginator._intl.firstPageLabel = this.translateService.instant('TABLE.PAGINATOR.FIRST_PAGE');
      matPaginator._intl.itemsPerPageLabel = this.translateService.instant('TABLE.PAGINATOR.ITEMS_PER_PAGE');
      matPaginator._intl.lastPageLabel = this.translateService.instant('TABLE.PAGINATOR.LAST_PAGE');
      matPaginator._intl.nextPageLabel = this.translateService.instant('TABLE.PAGINATOR.NEXT_PAGE');
      matPaginator._intl.previousPageLabel = this.translateService.instant('TABLE.PAGINATOR.PREVIOUS_PAGE');
      matPaginator._intl.getRangeLabel = this.paginatorService.getRangeLabel;

      return matPaginator;
    });
  }
}
