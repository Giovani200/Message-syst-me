import { Injectable } from '@angular/core'; // Permet de marquer cette classe comme un service injectable dans Angular.
import { HttpClient } from '@angular/common/http'; // Utilisé pour effectuer des requêtes HTTP vers une API.
import { io } from 'socket.io-client'; // Importation de la bibliothèque Socket.IO pour gérer les connexions WebSocket.

@Injectable({
  providedIn: 'root' // Fournit ce service à l'ensemble de l'application (service singleton).
})
export class ChatService {
  private socket = io('http://localhost:3000'); // Connexion au serveur WebSocket via Socket.IO.
  private apiUrl = 'http://localhost:3000/messages'; // URL de l'API pour récupérer les messages.

  constructor(private http: HttpClient) {} // Injection du service HttpClient pour effectuer des requêtes HTTP.

  /**
   * Envoie un message au serveur via WebSocket.
   * @param user - Nom de l'utilisateur qui envoie le message.
   * @param message - Contenu du message.
   */
  sendMessage(user: string, message: string) {
    this.socket.emit('sendMessage', { user, message }); // Émet un événement 'sendMessage' avec les données (utilisateur et message).
  }

  /**
   * Récupère les messages depuis l'API REST.
   * @returns Observable contenant un tableau de messages.
   */
  getMessages() {
    return this.http.get<any[]>(this.apiUrl); // Effectue une requête GET vers l'API pour récupérer les messages.
  }

  /**
   * Écoute les messages reçus en temps réel via WebSocket.
   * @param callback - Fonction à exécuter lorsqu'un message est reçu.
   */
  receiveMessages(callback: (message: any) => void) {
    this.socket.on('receiveMessage', callback); // Écoute l'événement 'receiveMessage' et exécute le callback avec le message reçu.
  }
}