import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterCompoenent } from './components/register/register';
import { App } from './app';
import { PlayersComponent } from './components/players-component/players-component';
import { Main } from './components/layout/main/main';

export const routes: Routes = [
    { path: "", component: Main },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterCompoenent },
    {
        path: 'players/:id', loadComponent: () =>
            import('./components/players-component/players-component').then(m => m.PlayersComponent),
        data: { requireId: true }
    }
];
