// importation des modules

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const { time } = require('console');
const { Socket } = require('dgram');

// initialisation de l'application 
//
const app = express();

// initilasation du server ou creation du server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"],
    }
});

// connection à la base de donné de mongoDB

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 3000


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error("Erreur de connection:", err));


// Middleware
app.use(cors());
app.use(express.json());


//récupération des messsages 
app.get('/messages', async (req, res) => {
    try {

        // .sort({ timestamp: 1 }) : Trie les messages par ordre 
        // croissant de leur champ timestamp (du plus ancien au plus récent).
        const messages = await Messages.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
})


// Socket.io : Gérer les messages en temps réel
/**
 * * La méthode io.on('connection') est utilisée pour écouter les connexions des clients.
 * 
 * io : C'est l'instance du serveur Socket.IO, créée avec new Server(server).
 * 
 * socket.on(eventName, callback); et le socket.on est use pour écouter un évènement 
 * 
 * io.emit (eventName, data); et le io.emit est utilisé pour émettre un évènement à tous les clients connectés.
 */
io.on('connection', (socket) => {
    console.log('New client connected: ', socket.id);

    socket.on('sendMessage', async (data) => {
        try {
            const newMessage = new Message(data)
            await newMessage.save();
            io.emit('receiveMessage', newMessage); // Emit the message to all connected clients
        } catch (error) {
            console.error("❌ Erreur lors de l'envoi du message :", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ Un utilisateur déconnecté :", socket.id)
    });
});

// Lancer le serveur
server.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));