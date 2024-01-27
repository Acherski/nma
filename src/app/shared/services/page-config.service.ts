import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class PaginatorService {
  decimalPipe = new DecimalPipe(navigator.language);

  constructor(private translateService: TranslateService) {}

  public translatePaginator(paginator: MatPaginator): MatPaginator {
    const matPaginator = paginator;
    matPaginator._intl.firstPageLabel = this.translateService.instant('TABLE.PAGINATOR.FIRST_PAGE');
    matPaginator._intl.itemsPerPageLabel = this.translateService.instant('TABLE.PAGINATOR.ITEMS_PER_PAGE');
    matPaginator._intl.lastPageLabel = this.translateService.instant('TABLE.PAGINATOR.LAST_PAGE');
    matPaginator._intl.nextPageLabel = this.translateService.instant('TABLE.PAGINATOR.NEXT_PAGE');
    matPaginator._intl.previousPageLabel = this.translateService.instant('TABLE.PAGINATOR.PREVIOUS_PAGE');
    matPaginator._intl.getRangeLabel = this.getRangeLabel;

    return matPaginator;
  }

  public getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const start = page * pageSize + 1;
    const end = (page + 1) * pageSize;
    return `${start} - ${end <= length ? end : length} ${this.translateService.instant(
      'TABLE.PAGINATOR.RANGE'
    )} ${length}`;
  };
}
