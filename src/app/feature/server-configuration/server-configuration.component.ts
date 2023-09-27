import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
// import { ServerConfigurationComponentStore } from './server-configuration-component-store.store';
import { TableComponent } from 'src/app/design-system/table/table.component';
import { TableConfig } from 'src/app/design-system/table/table-config.interface';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nma-server-configuration',
  templateUrl: './server-configuration.component.html',
  imports: [CommonModule, HeaderComponent, TranslateModule, DialogModule, TableComponent],
  // providers: [provideComponentStore(ServerConfigurationComponentStore)],
})
export class ServerConfigurationComponent {
  // protected componentStore = inject(ServerConfigurationComponentStore);
  protected tableConfig: TableConfig = {
    columns: ['SERVER_CONFIGURATION.COLUMN.KEY', 'SERVER_CONFIGURATION.COLUMN.VALUE'],
    deleteButton: true,
    editButton: false,
    noColumnDisplay: true,
    changePasswordButton: true,
  };

  openEditDialog(value: unknown) {
    console.log(value);
  }
}
