import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import { IonicModule } from '@ionic/angular'; // Importa el módulo de Ionic
import { Router } from '@angular/router';


@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecuperarContrasenaPage implements OnInit {
  email: string = '';
  message: string = ''; // Mensaje para mostrar al usuario


  constructor(private storageService: StorageService,private router:Router) {}

  async ngOnInit() {

  }

  async recoverPassword() {
    // Obtener la lista de usuarios desde el almacenamiento
    const users = (await this.storageService.get('users')) || [];

    // Verificar si el correo existe
    const userExists = users.some((user: any) => user.email === this.email);

    if (userExists) {
      this.message = 'Si el usuario existe, revise su bandeja de entrada.';
    } else {
      this.message = 'Si el usuario existe, revise su bandeja de entrada.'; // Mismo mensaje para evitar fuga de información.
    }

    setTimeout(() => {
      this.router.navigate(['login']);
    }, 3000);



    // Limpiar el campo de correo después de buscar
    this.email = '';
  }
  
  

}
