import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PrincipalPage {
  constructor(private router: Router) {}


  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToHomePasajero() {
    this.router.navigate(['/home-pasajero']);
  }
}
