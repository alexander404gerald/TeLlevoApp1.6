import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilUsuarioPage implements OnInit {

  constructor(    private router: Router // Inyecta Router
  ) { }

  ngOnInit() {
  }

  async login(){
    this.router.navigate(['/login']);
    

  };
  async siguiente(){
    this.router.navigate(['/registro-usuario']);
    

  };
}
