import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../storage.service';
declare var google:any;

@Component({
  selector: 'app-home-pasajero',
  templateUrl: './home-pasajero.page.html',
  styleUrls: ['./home-pasajero.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class HomePasajeroPage implements OnInit {
  viaje = {
    destino: '',
    capacidad: null,
    costoPasajero: null,
    horaSalida: '',
    programacion: '',
    identificador: '' // Se genera automáticamente
  };

  viajes: any[] = [];
  viajeSeleccionado: any = null; // Viaje actualmente seleccionado
  asientosReservados: number = 0; // Cantidad de asientos reservados para el viaje seleccionado
  seleccionarViaje(index: number) {
    this.viajeSeleccionado = this.viajes[index];
    this.asientosReservados = 0; // Reiniciar la selección de asientos
  
    // Asignar el destino al campo con id="autocomplete"
    const autocompleteInput = document.getElementById('autocomplete') as HTMLInputElement;
    if (autocompleteInput) {
      autocompleteInput.value = this.viajeSeleccionado.destino;
    }
  }
  async ngOnInit() {
    this.dibujarMapa(); // Solo dibuja el mapa al inicio
    await this.cargarViajes(); // Cargar los viajes

  }
  

  // Confirmar reserva de asientos
  async reservarAsientos() {
    if (this.viajeSeleccionado) {
      const asientosDisponibles = this.viajeSeleccionado.capacidad;
  
      // Validar la cantidad ingresada
      if (this.asientosReservados <= 0 || this.asientosReservados > asientosDisponibles) {
        alert(`La cantidad de asientos debe ser entre 1 y ${asientosDisponibles}.`);
        return;
      }
  
      // Descontar los asientos reservados de la capacidad total
      this.viajeSeleccionado.capacidad -= this.asientosReservados;
  
      // Actualizar los asientos reservados acumulados
      this.viajeSeleccionado.asientosReservados = (this.viajeSeleccionado.asientosReservados || 0) + this.asientosReservados;
  
      // Guardar los cambios en el almacenamiento
      const index = this.viajes.findIndex(v => v.identificador === this.viajeSeleccionado.identificador);
      if (index > -1) {
        this.viajes[index] = this.viajeSeleccionado; // Actualizar en la lista local
        await this.storageService.set('viajes', this.viajes); // Guardar cambios en el storage
        console.log('Reserva confirmada y almacenamiento actualizado:', this.viajes[index]);
      }
  
      // Resetear selección
      this.viajeSeleccionado = null;
      this.asientosReservados = 0;
  
      // Refrescar la lista de viajes
      await this.cargarViajes();
    }
  }
  
  mapa:any;
  marker:any;
  puntoreferencia={lat:-33.59839099301328 , lng:-70.57879206793994 } //latitud y longitud
  search:any;
  //variable para calcular 2 puntos
  directionsService:any;
  directionsRenderer:any;  
  constructor(private storageService: StorageService) { }

 

  async cargarViajes() {
    // Cargar los viajes desde el almacenamiento
    this.viajes = await this.storageService.getViajes() || [];
    console.log('Viajes cargados desde el almacenamiento:', this.viajes);
  
    // Validar los asientos disponibles para cada viaje
    this.viajes.forEach(viaje => {
      if (!viaje.asientosReservados) {
        viaje.asientosReservados = 0; // Inicializar si no está definido
      }
    });
  }
  async dibujarMapa(){
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
  async buscaDireccion(mapaLocal: any, marcadorLocal: any) {
    const input = document.getElementById('autocomplete') as HTMLInputElement;
  
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      this.search = autocomplete;
  
      // Agregar el movimiento al mapa
      autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace().geometry.location; // Obtener lat y lng del destino
        mapaLocal.setCenter(place);
        mapaLocal.setZoom(13);
        marcadorLocal.setPosition(place);
      });
    } else {
      console.error('Elemento con id="autocomplete" no encontrado.');
    }
  }
  
  async calculaRuta() {
    const origen = this.puntoreferencia; // Punto de referencia definido
    const input = document.getElementById('autocomplete') as HTMLInputElement;
  
    if (!input || !input.value) {
      alert('Por favor, selecciona un destino válido.');
      return;
    }
  
    const destino = input.value; // Obtener el valor del destino desde el campo
  
    // Configurar la solicitud de ruta
    const request = {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    // Solicitar la ruta al DirectionsService de Google Maps
    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result); // Mostrar la ruta en el mapa
      } else {
        alert('Error al calcular la ruta. Verifica el destino.');
      }
    });
  }
  
  
  
  async mostrarViajes() {
    this.storageService.getViajes();
    console.log('Viajes cargados desde el almacenamiento:');
  }

}
