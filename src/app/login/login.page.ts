import { Component,OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Importa el módulo de Ionic
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar [(ngModel)]
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas básicas
import { StorageService } from '../storage.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule], // Importa los módulos necesarios
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private router: Router, // Inyecta Router
    private menuCtrl: MenuController
  ) {}
  showMenu: boolean = true; // Inicialización por defecto

  async ngOnInit() {
    this.showMenu = false;
  }

  async login() {
    // Recuperar los usuarios almacenados en el storage
    const users = (await this.storageService.get('users')) || [];
  
    // Validar si el usuario y la contraseña coinciden con algún registro
    const user = users.find(
      (u: any) => u.email === this.email && u.password === this.password
    );
  
    if (user) {
      // Mostrar alerta de éxito
      user.isAutenticado = true;
  
      await this.storageService.set('users', users); // Guardar los usuarios con el estado actualizado
  
      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'Inicio de sesión exitoso.',
        buttons: ['OK'],
      });
      await alert.present();
  
      // Redirigir según el dominio del correo
      if (this.email.endsWith('@duocuc.cl')) {
        // Habilitar el menú
        this.menuCtrl.enable(true);
  
        // Navegar a la página principal
        this.router.navigate(['tabs/principal']);
      } else {
        // Redirigir a una ruta por defecto o mostrar un mensaje de error
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'El dominio del correo no es válido.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      // Mostrar alerta de error
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Correo o contraseña incorrectos.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  
  
  

  async enviarRegistro(){
    this.router.navigate(['/perfil-usuario']);
    

  };


  async recupera(){
    this.router.navigate(['/recuperar-contrasena']);
    

  };
}
