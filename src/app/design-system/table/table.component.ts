import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CallState, LoadingState } from 'src/app/constants/callstate.constant';
import { LetDirective } from '@ngrx/component';
import { TableConfig } from './table-config.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'nma-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SpinnerComponent, MatTooltipModule, TranslateModule, LetDirective, MatIconModule],
})
export class TableComponent<T> {
  @Input({ required: true }) callState!: Observable<CallState>;
  @Input({ required: true }) data!: Observable<T[]>;
  @Input({ required: true }) config!: TableConfig;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() changePassword = new EventEmitter();

  readonly LoadingState = LoadingState;

  onEditEvent(item: T) {
    this.edit.emit(item);
  }

  onDeleteEvent(item: T) {
    this.delete.emit(item);
  }

  onChangePasswordEvent(item: T) {
    this.changePassword.emit(item);
  }
}
