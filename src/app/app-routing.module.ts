import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { MyIssuesComponent } from './pages/my-issues/my-issues.component';
import { LoggedInGuard } from './core/logged-in.guard';

const routes: Routes = [
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'users/:id',
    component: UserDetailComponent
  },
  {
    path: 'my-issues',
    component: MyIssuesComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: '**',
    redirectTo: 'users',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
