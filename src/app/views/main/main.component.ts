import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideNavComponent } from 'src/app/shared/components/side-nav/side-nav.component';

@Component({
  selector: 'nma-main-view',
  standalone: true,
  templateUrl: 'main.component.html',
  imports: [RouterModule, SideNavComponent],
})
export class MainViewComponent {}
