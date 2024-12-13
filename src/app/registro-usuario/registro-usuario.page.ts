import { Component } from '@angular/core';
import { StorageService } from '../storage.service'; 
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar [(ngModel)]
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas básicas
import { Router } from '@angular/router';



@Component({
  selector: 'registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule, CommonModule], // Importa los módulos necesarios
})



export class RegistroUsuarioPage {
  email: string = '';
  password: string = '';
  users: any[] = [];
  showUsers: boolean = false; // Controlar la visibilidad de la lista de usuarios
  

  constructor(
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private router: Router // Inyecta Router

  ) {}

  async ngOnInit() {
    
    // Cargar usuarios al iniciar la página
    this.users = (await this.storageService.get('users')) || [];
  }
  
  async enviarLogin(){
    this.router.navigate(['/login']);

  };

  toggleUserList() {
    this.showUsers = !this.showUsers;
  }
  async register() {
    // Recuperar la lista actual de usuarios
    const existingUsers = this.users;

    // Verificar si el usuario ya existe
    const userExists = existingUsers.find((user: any) => user.email === this.email);
    if (userExists) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'El usuario ya está registrado.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Agregar el nuevo usuario
    existingUsers.push({ 
      email: this.email, 
      password: this.password,
      isAutenticado: false
     
    });
    await this.storageService.set('users', existingUsers); // Guardar en el almacenamiento
    this.users = existingUsers; // Actualizar la lista local

    // Notificar éxito
    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message: 'Usuario registrado correctamente.',
      buttons: ['OK'],
    });
    await alert.present();

    // Limpiar los campos
    this.email = '';
    this.password = '';
  }

  async loadUsers() {
    this.showUsers = !this.showUsers; // Alternar visibilidad
    if (this.showUsers) {
      this.users = (await this.storageService.get('users')) || [];
    }
  }

  async deleteUser(index: number) {
    // Eliminar usuario localmente
    this.users.splice(index, 1);

    // Actualizar el almacenamiento
    await this.storageService.set('users', this.users);

    // Notificar que el usuario fue eliminado
    const alert = await this.alertCtrl.create({
      header: 'Usuario Eliminado',
      message: 'El usuario ha sido eliminado correctamente.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
