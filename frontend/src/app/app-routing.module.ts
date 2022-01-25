import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EventViewDetailsComponent } from './components/event/event-view-details/event-view-details.component'
import { ClientFullPageComponent } from './components/client/client-full-page/client-full-page.component';
import { AdminFullPageComponent } from './components/admin/admin-full-page/admin-full-page.component';
import { JwtClientGuard } from './guards/jwtClient.guard';
import { ClientViewProfileComponent } from './components/client/client-view-profile/client-view-profile.component';
import { ClientTicketsComponent } from './components/client/client-tickets/client-tickets.component';
import { ClientCovidTestsComponent } from './components/client/client-covid-tests/client-covid-tests.component';


const routes: Routes = [

  {
    path: 'admin', component: AdminFullPageComponent
  },
  {
    path: 'client', component: ClientFullPageComponent,
    canActivate: [JwtClientGuard],
    children: [
      { path: 'profile', component: ClientViewProfileComponent, },
      { path: 'tickets', component: ClientTicketsComponent, },
      { path: 'covidTests', component: ClientCovidTestsComponent, },
    ]
  },
  {
    path: 'event-view-details/:id', component: EventViewDetailsComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: '**',
    loadChildren: () => new Promise(() => { window.location.href = 'http://localhost:3000/'; })
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
