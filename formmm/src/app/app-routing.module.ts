import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import {HomeComponent} from 'src/app/components/home/home.component';
import {EditUserComponent} from 'src/app/components/edit-user/edit-user.component';

import { EditUserResolver } from 'src/app/components/edit-user/edit-user.resolver';
import {NewUserComponent} from 'src/app/components/new-user/new-user.component';
import { TestComponent } from './components/test/test.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserinfoComponent } from './pages/userinfo/userinfo.component';


const routes: Routes = [

  // { path: '', component: TestComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
   { path: 'home', component: HomeComponent },
   { path: 'new-user', component: NewUserComponent },
   { path: 'test', component: TestComponent },
 
   
  { path: 'details/:id', component: EditUserComponent, resolve:{data : EditUserResolver}},

  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'userinfo', component: UserinfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
