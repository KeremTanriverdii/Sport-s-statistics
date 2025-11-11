import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterCompoenent } from './components/register/register';
import { App } from './app';

export const routes: Routes = [
    { path: "", component: App },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterCompoenent }
];
