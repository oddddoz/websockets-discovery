# Websocket: Chat server

Voici le projet qui permet de démarrer un serveur socketio.

## Objectif
Faire fonctionner, en local, le serveur avec votre propre client et interface de chat.

## Prérequis

1. `node` et `npm` doivent être installés sur votre machine. Voir [ici](https://nodejs.org/en/download) pour l´installation.

2. Clonez ce repo. Installez les dépendences en executant `npm install` à la racine de ce projet.

3. Démarrez le serveur websocket avec `npm run start` ou `node server.js`. 

4. Branchez votre client pour supporter les différentes fonctionnalités du serveur. *(pour voir les fonctionnalités et évennements attendus, regardez le code présent dans `server.js` et la [documentation de socket.io](https://socket.io/docs/v4/)*


### Simple

Faite au plus simple. Lisez la documentation *(ou demandez à un LLM...)* et le fichier `server.js`. 

> Attention! votre fichier `.html` doit être démarré avec une extension VSCODE comme 'Live Server'
> Autrement, en y accédant via son path absolu, des sécurités sont misent en place et vous ne pourrez pas vous connecter au server socket.io

### Modifications du `server.js`

Idéalement, sans modifier le code du serveur, vous devez être capable de brancher votre interface.  
En revanche, si la partie serveur coince pour vous. Il est autorisé de le modifier.
