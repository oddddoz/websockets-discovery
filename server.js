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
// Comme celui de votre extension Live Server par exemple
// On donne le serveur HTTP sur lequel socket io va se reposer 
const io = new Server(httpServer, {
	cors: { origin: "*" }
});

// Logique et déclaration des évenements. 
io.on("connection", (socket) => {
	// Lorsqu'un client se connect on le compte.
	connected_client_amout += 1;
	console.info("New connection: " + socket.id)
	console.info(connected_client_amout + " clients connected.\n")

	// On emet l'historique des message sur le socket (pour ce client uniquement)
	socket.emit("message_history", conversation.retrieveMessages())

	// On ecoute l'evenement 'new_message' qui doit venir du client.
	socket.on("new_message", (payload) => {
		// On ajoute le message à l'historique, pour pouvoir le récuperer lors qu'on revient plus tard
		// ou qu'un autre client se connecte
		const msg = conversation.addMessage(payload.user, payload.content);

		console.log("New message!\n   Convo is now: " + conversation.retrieveConvoLenght() + " messages long!");

		// On emet le message en utilisant io cette fois ci (pour tout les client connectés au serveur)
		// Tout les clients recevront donc cet evenement
		io.emit("message", msg);
	});

	// On écoute l'evenement disconnect
	// Cet evenement est géré tout seul par la librairie socketio client
	socket.on("disconnect", () => {
		// On diminue le compteur de connexion pour avoir un nombre d'utilisateur en ligne à jour
		connected_client_amout -= 1;
		console.info('Connection lost: ' + socket.id);
		console.info(connected_client_amout + ' clients remaining.\n');
	})
});

// On démarre le serveur HTTP sur lequel socket.io s'est branché sur le port 3000
const PORT = 3000;
httpServer.listen(PORT);

console.info("Listenning on " + PORT);
