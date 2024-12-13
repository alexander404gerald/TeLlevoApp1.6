import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, car, peopleCircleOutline, peopleOutline } from 'ionicons/icons';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    RouterLink,
    RouterLinkActive
    ]
})
export class TabsPage implements OnInit {

  constructor(
    private router: Router,private storageService: StorageService
  ) {
    addIcons({
      'home': home,
      car,
      peopleOutline
    });
   }

  async ngOnInit() {
  }
    showMenu: boolean = true;



  async irInicio(){
    this.router.navigate(['/tabs/principal']);
  }
  async irlogin(){
    this.router.navigate(['/login']);
    this.showMenu = false;

  }

  async ngAfterViewInit() {
    const users = (await this.storageService.get('users')) || [];
    // Validar si el usuario y la contraseña coinciden con algún registro
    const isAutenticado = users.find(
      (u: any) => u.isAutenticado === true
    );
    if(isAutenticado){
      this.showMenu = true;
    }else{
      this.showMenu = false;
    }
  }

  async cerrarSesion(){
    this.showMenu = false;    
    const users = (await this.storageService.get('users')) || [];
    users.forEach((user: any) => {
      user.isAutenticado = false;
    });  
    // Guardar la lista de usuarios con el atributo actualizado
    await this.storageService.set('users', users);
  }
  async irconductor(){
    this.router.navigate(['/home']);
  }

  async irpasajero(){
    this.router.navigate(['/home-pasajero']);
  }


 
}
