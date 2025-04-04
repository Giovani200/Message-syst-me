import { Component } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: string = ''; // Propriété pour le pseudo de l'utilisateur
  message: string = ''; // Propriété pour le message
  messages: any[] = []; // Tableau pour stocker les messages

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Récupérer les messages existants
    this.chatService.getMessages().subscribe((data) => {
      this.messages = data;
    });

    // Écouter les messages en temps réel
    this.chatService.receiveMessages((message) => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.user, this.message);
      this.message = ''; // Réinitialise le champ de saisie
    }
  }
}