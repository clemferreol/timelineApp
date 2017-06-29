const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use( '/node_modules', express.static(path.join(__dirname, 'node_modules')) );
app.use( express.static(path.join(__dirname, 'public')) );

io.on('connection', socket => {

    const currentUser = {
        id     : null,
        pseudo : null
    };

    socket.on('setPseudo', pseudo => {
        currentUser.id     = socket.id;
        currentUser.pseudo = pseudo;

        socket.broadcast.emit('newUser', currentUser);

    });
    socket.on('post', (post) => {
        socket.broadcast.emit('post', {
            pseudo : currentUser.pseudo,
            text   : post,

        });
    });

    socket.on('image', (image) => {
        socket.broadcast.emit('image', {
            pseudo : currentUser.pseudo,
            image   : image,

        });
    });

    socket.on('date', (date) => {
        socket.broadcast.emit('date', {
            pseudo : currentUser.pseudo,
            date   : date,

        });
    });

    socket.on('disconnect', () => {

    });

}); // Fin du "onconnection"

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Le serveur écoute sur le port ${port}`));
