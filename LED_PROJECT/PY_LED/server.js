var http = require('http');
var fs = require('fs');
const { stringify } = require('querystring');

var led_state = 0

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
	//Debug
    console.log('New client connected');
    
	//Reception du pseudo du nouveau client
	socket.on('new_client',function(pseudo) {
        socket.pseudo=pseudo;                           //Création d'une variable pseudo dans la variable socket
        socket.emit('stateLED', led_state);             //Envoi état actuel de la LED

        //Debug
        console.log('Nouveau client : ' + pseudo)
	});
    
    //Reception de la configuration de l'état de la LED par un client
    socket.on('setLED', function(setLED) {
        if(socket.pseudo=="undefined")
            return

        led_state=(!led_state)?1:0;                     //On choisit le nouvel état de la LED
        socket.broadcast.emit('stateLED',led_state);    //On envoie a tous les clients pour actualiser le code
        socket.emit('stateLED',led_state);              //Envoi au client actuel ayant causée la requête

        //Debug
        console.log(((!led_state)?'Eteinte':'Allumée') + ' par ' + socket.pseudo);

    });

});


server.listen(1312);