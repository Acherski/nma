import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainViewComponent } from './feature/main/main.component';
import { AuthComponent } from './feature/auth/auth.component';
import { AuthGuardService } from './feature/auth/auth.guard';
import { ServerConfigurationComponent } from './feature/server-configuration/server-configuration.component';
import { UserListComponent } from './feature/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: MainViewComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserListComponent },
      { path: 'server-settings', component: ServerConfigurationComponent },
    ],
  },
  { path: 'login', component: AuthComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
