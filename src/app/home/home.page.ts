import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { search, home, person } from 'ionicons/icons';
import { StorageService } from '../storage.service';

//declarar una variable de google
declare var google:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomePage implements OnInit {
  costos = [1000, 1500, 2000, 2500, 3000]; // Opciones de costo
  showMenu: boolean = true;


  // Datos del viaje
  viaje = {
    destino: '',
    capacidad: null,
    costoPasajero: null,
    horaSalida: '',
    programacion: '',
    identificador: '' // Se genera automáticamente
  };

  viajes: any[] = [];

  //otras variables
  mapa:any;
  marker:any;
  puntoreferencia={lat:-33.59839099301328 , lng:-70.57879206793994 } //latitud y longitud
  search:any;
  //variable para calcular 2 puntos
  directionsService:any;
  directionsRenderer:any;  

  constructor(private storageService: StorageService) { 
    addIcons({
      home,
      person,
      search,
      });
      this.showMenu = false;

  }

  async ngOnInit() {
    this.dibujarMapa();
    this.buscaDireccion(this.mapa,this.marker);
    this.mostrarViajes();

  }
  async guardarViaje() {
    console.log('Datos actuales del viaje:', this.viaje);

    // Verificar que todos los campos estén completos
    if (this.viaje.destino && this.viaje.capacidad && this.viaje.costoPasajero && this.viaje.programacion) {
      // Generar el identificador dinámicamente
      this.viaje.identificador = Date.now().toString();
      console.log('Identificador generado:', this.viaje.identificador);

      // Guardar el viaje en el almacenamiento
      await this.storageService.addViaje({ ...this.viaje });
      console.log('Viaje guardado exitosamente.');

      // Resetear el objeto viaje
      this.viaje = {
        destino: '',
        capacidad: null,
        costoPasajero: null,
        horaSalida: '',
        programacion: '',
        identificador: ''
      };

      this.mostrarViajes();
    } else {
      console.error('Error: No se puede guardar el viaje. Datos incompletos.');
    }
  }

  async mostrarViajes() {
    this.viajes = await this.storageService.getViajes();
    console.log('Viajes cargados desde el almacenamiento:', this.viajes);
  }

  dibujarMapa(){
    var mapElement=document.getElementById('map')
    // valido que que la variable existe
    if(mapElement){
      // crea un nuevo mapa
      this.mapa= new google.maps.Map(
        mapElement,
        {
          center:this.puntoreferencia,
          zoom:15 // 1 a 25
        });
      this.marker =  new google.maps.Marker(
        {
          position: this.puntoreferencia,
          map:this.mapa
        }
      )};
      // inicializo las variables para calcular
      this.directionsService=new google.maps.DirectionsService();
      this.directionsRenderer=new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.mapa)
      // variables para leer caja de instrucciones
      var trayecto =document.getElementById('trayecto') as HTMLInputElement | null;
      this.directionsRenderer.setPanel(trayecto);
  } // fin dibujar mapa
  buscaDireccion(mapaLocal:any,marcadorLocal:any){
    var input=document.getElementById('autocomplete')
    if(input){
      const autocomplete=new google.maps.places.Autocomplete(input);
      this.search=autocomplete;
      // Agregamos el movimiento al mapa
     autocomplete.addListener('place_changed',function(){
     const place=autocomplete.getPlace().geometry.location;  // lat y long del texto de la caja
     mapaLocal.setCenter(place); 
     mapaLocal.setZoom(13);
     marcadorLocal.setPosition(place); 
     });
     }else {
      alert("Elemento con id=autocomplete no encontrado");
     }// fin if     
  } // fin busca direccion
  calculaRuta(){
    //alert('Calculo de la ruta en progreso');
    const origen=this.puntoreferencia;
    const destino=this.search.getPlace().geometry.location;
    const  request={
      origin: origen,
      destination:destino,
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsService.route(request,
          (result:any,status:any) =>{
            if (status === google.maps.DirectionsStatus.OK){
              this.directionsRenderer.setDirections(result)
            }else{
              alert('Error al calcular ruta');
            }
            this.marker.setPosition(null)
          }            
        )//fin result service
  } // fin c
  async eliminarViaje(index: number) {
    // Usamos otra variable para evitar el conflicto con el método nativo `confirm`
    const userConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este viaje?');
    if (userConfirmed) {
      // Eliminar el viaje del arreglo local
      this.viajes.splice(index, 1);
  
      // Actualizar el almacenamiento con los datos restantes
      await this.storageService.set('viajes', this.viajes);
  
      // Refrescar la tabla
      console.log('Viaje eliminado. Viajes restantes:', this.viajes);
    }
  }
  

}
