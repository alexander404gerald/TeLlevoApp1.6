import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login',pathMatch: 'full',}
  ,  
  { path: 'registro-usuario', loadComponent: () => import('./registro-usuario/registro-usuario.page').then(m => m.RegistroUsuarioPage) }
  ,
  { path: 'login', loadComponent: () => import('./login/login.page').then( m => m.LoginPage)}
  ,  
  { path: 'tabs', loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage),
    children: [      
      { path: 'principal',loadComponent: () => import('./principal/principal.page').then( m => m.PrincipalPage) },
      { path: 'home-pasajero', loadComponent: () => import('./home-pasajero/home-pasajero.page').then( m => m.HomePasajeroPage)},
      { path: 'perfil-usuario', loadComponent: () => import('./perfil-usuario/perfil-usuario.page').then( m => m.PerfilUsuarioPage)}
    ]
  },
  { path: 'perfil-usuario', loadComponent: () => import('./perfil-usuario/perfil-usuario.page').then( m => m.PerfilUsuarioPage)} ,
  { path: 'recuperar-contrasena', loadComponent: () => import('./recuperar-contrasena/recuperar-contrasena.page').then(m => m.RecuperarContrasenaPage)},
  { path: 'home-pasajero', loadComponent: () => import('./home-pasajero/home-pasajero.page').then( m => m.HomePasajeroPage) },
  { path: 'home', loadComponent: () => import('./home/home.page').then( m => m.HomePage)},
  { path: 'principal',loadComponent: () => import('./principal/principal.page').then( m => m.PrincipalPage) }


];
