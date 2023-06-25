import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './shared/auth/auth-guard';
import { ClienteFormComponent } from './modules/cliente/form/cliente.form.component';
import { ClienteListComponent } from './modules/cliente/list/cliente.list.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { HomeComponent } from './modules/home/home.component';
import { AvaliacaoListComponent } from './modules/avaliacao/list/avaliacao.list.component';
import { AvaliacaoFormComponent } from './modules/avaliacao/form/avaliacao.form.component';

const routes: Routes = [
  { path: '', redirectTo: 'app/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'app', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'cliente',
        component: ClienteListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'cliente/novo',
        component: ClienteFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'cliente/:id',
        component: ClienteFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'avaliacao',
        component: AvaliacaoListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'avaliacao/novo',
        component: AvaliacaoFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'avaliacao/:id',
        component: AvaliacaoFormComponent,
        canActivate: [AuthGuard]
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
