import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular'; // Importa el módulo de Ionic
import { addIcons } from 'ionicons';
import { logOutOutline, logOutSharp, home, person } from 'ionicons/icons';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,IonicModule
  ],
})
export class AppComponent {
  showMenu: boolean = false;

  constructor(private storageService: StorageService, private router: Router) {

    addIcons({home,person,logOutOutline,logout:logOutSharp});
  }

  async ngAfterViewInit() {
    const users = (await this.storageService.get('users')) || [];
    const isAutenticado = users.find((u: any) => u.isAutenticado === true);

    // Si hay un usuario autenticado, habilita el menú y redirige a la página principal
    if (isAutenticado) {
      this.showMenu = true;
      this.router.navigate(['/tabs/principal']);
    } else {
      this.showMenu = false;
      this.router.navigate(['/login']);
    }
  }

  async cerrarSesion() {
    this.showMenu = false;
    const users = (await this.storageService.get('users')) || [];

    // Actualiza el estado de autenticación de los usuarios
    users.forEach((user: any) => {
      user.isAutenticado = false;
    });

    await this.storageService.set('users', users);

    // Redirige al login después de cerrar sesión
    this.router.navigate(['/login']);
  }
}
