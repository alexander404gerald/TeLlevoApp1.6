import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageModule } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }
  private async ensureInitialized() {
    if (!this._storage) {
      await this.init();
    }
  }

  async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }
  async get(key: string): Promise<any> {
    await this.ensureInitialized(); // Asegura la inicialización
    return await this._storage?.get(key);
  }

  async remove(key: string) {
    await this.ensureInitialized(); // Asegura la inicialización
    await this._storage?.remove(key);
  }

  //29/11/2024

  async addViaje(viaje: any) {
    let viajes = await this.get('viajes') || []; // Obtener la lista existente de viajes
    viajes.push(viaje); // Agregar el nuevo viaje
    await this.set('viajes', viajes); // Guardar la lista actualizada
  }

  async getViajes() {
    return await this.get('viajes') || [];
  }



}
