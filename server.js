import { createServer } from "http";
import { Server } from "socket.io";

// La classe history permet de stocker l'historique en mémoire
// Pas d'écriture de fichier disque ou de db attendu
// Si le serveur redémarre, this.history est redéclaré et l'historique est vidée.
class History {
	constructor() {
		this.history = [];
	}

	addMessage(user, content) {
		const msg = { user, content, received_at: Date.now() };
		this.history.push(msg);
		return msg;
	}

	retrieveMessages() {
		return this.history;
	}

	retrieveConvoLenght() {
		return this.history.length;
	}
}

// Variable globale, mauvaise habitude
// Mais pratique dans notre cas avoir un compteur de connexion simple.
let connected_client_amout = 0;


const conversation = new History();
const httpServer = createServer();

// CORS: origin = * permet au serveur de recevoir des requetes venant d'autre serveurs
const io = new Server(httpServer, {
	cors: { origin: "*" }
});

io.on("connection", (socket) => {
	connected_client_amout += 1;
	console.info("New connection: " + socket.id)
	console.info(connected_client_amout + " clients connected.\n")

	socket.emit("message_history", conversation.retrieveMessages())

	socket.on("new_message", (payload) => {
		const msg = conversation.addMessage(payload.user, payload.content);

		console.log("New message!\n   Convo is now: " + conversation.retrieveConvoLenght() + " messages long!");

		io.emit("message", msg);
	});

	socket.on("disconnect", () => {
		connected_client_amout -= 1;
		console.info('Connection lost: ' + socket.id);
		console.info(connected_client_amout + ' clients remaining.\n');
	})
});

const PORT = 3000;

console.info("Listenning on " + PORT);
httpServer.listen(PORT);
