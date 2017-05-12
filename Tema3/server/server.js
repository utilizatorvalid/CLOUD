let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const Player = require('./Players')
const Game = require('./Game')

let players = [];
let games = [];

io.on('connection', (socket) => {
    user_id = getLastUserID()
    console.log('user connected', user_id);
    //console.log(players)
    players.push(new Player(user_id, socket));
    socket.emit('new_id', {
        id: user_id
    })


    socket.emit('all_players', {
        users: players.map((element) => {
            if (element.name == "Incognito")
                return null;
            if (element.in_game)
                return null;

            
            return element.removeSocket();
        })
    })


    socket.on('disconnect', function () {
        var user = findUser('socket', socket)
        var game = findGame('id', user.player.id);
        console.log('user with id =' + user.player.id + 'disconnected');
        players.splice(user.index, 1);
        // console.log(players)
        io.emit("player_offline", {
            user: user.player.removeSocket()
        });
        console.log(players.count)
        if (game.opponent)
            game.opponent.socket.emit("end_game")
    });

    socket.on('add-message', (message) => {

        var game = findGame('id', message.id);
        if (!game.me)
            return;
        console.log("game_message", game)
        console.log(game.me.id, "send a message to ", game.opponent.id)
        timestamp = new Date();
        console.log(game);
        game.opponent.socket.emit('message', {
            type: 'new-message',
            sender_id: game.me.id,
            sender_name: game.me.name,
            sender_pic: game.me.url_img,
            time_h_m: timestamp.getHours() + ':' + timestamp.getMinutes(),
            text: message.text
        });
        game.me.socket.emit('message', {
            type: 'new-message',
            sender_id: game.me.id,
            sender_name: game.me.name,
            sender_pic: game.me.url_img,
            time_h_m: timestamp.getHours() + ':' + timestamp.getMinutes(),
            text: message.text
        });


    });
    socket.on('player_updata', (data) => {
        var user = findUser('socket', socket);
        user.player.name = data.name;
        user.player.url_img = data.url_img
        console.log("update data ", data);
        io.emit("new_player_enter", {
            user: data
        });

    });

    socket.on('game_invite', (data) => {

        var user1 = findUser('id', data.invite_from)
        var user2 = findUser('id', data.invite_to);
        console.log("from", user1.player)
        console.log("to", user2.player)
        if (user2.index == -1) {
            return user1.player.socket.emit('game_invite_res', {
                game_start: false,
                info: "player went out"
            });
        }

        if (user2.player.in_game) {
            return user1.player.socket.emit('game_invite_res', {
                game_start: false,
                info: "player is in game"
            });
        }
        games.push(new Game(user1.player, user2.player));
        user2.player.socket.emit('game_invite', {
            invite_from: user1.player.removeSocket()
        })



    })

    socket.on('accept_invite', (data) => {
        console.log('accept_invite', data.me);
        var player = data.me;
        var s_game = null
        for (var game of games) {
            if (game.p2.id == player.id) {
                s_game = game;
            }
        }
        if (!s_game)
            return;
        startGame(s_game);

    })
    socket.on('reject_invite', (data) => {
        console.log('reject_invite', data.me);
        var player = data.me;
        var s_game = null
        for (var game of games) {
            if (game.p2.id == player.id) {
                s_game = game;
            }
        }
        if (!s_game)
            return;
        s_game.p1.socket.emit("reject_invite", {
            opponent: s_game.p2.removeSocket()
        });
        games.splice(games.indexOf(s_game), 1);

    })
    socket.on('game_end', (data) => {
        console.log("game_end", data);
        var game = findGame('id', data.me.id);
        console.log('game.end', game.me, game.opponent);
        if (!game.me)
            return;
        endGame(game);
    })
});

function startGame(game) {

    game.p1.socket.emit('clear_message', {});
    game.p2.socket.emit('clear_message', {});

    game.p1.socket.emit('start_game', {
        opponent: game.p2.removeSocket()
    })
    game.p2.socket.emit('start_game', {
        opponent: game.p1.removeSocket()
    })
    game.p1.in_game = true;
    game.p2.in_game = true;

    io.emit("player_offline", {
        user: game.p1.removeSocket()
    });
    io.emit("player_offline", {
        user: game.p2.removeSocket()
    });
}

function endGame(game) {
    game.me.socket.emit('end_game', {})
    game.opponent.socket.emit('end_game', {})
    game.me.in_game = false;
    game.opponent.in_game = false;

    io.emit("new_player_enter", {
        user: game.me.removeSocket()
    });
    io.emit("new_player_enter", {
        user: game.opponent.removeSocket()
    });
    game.me.in_game = false;
    game.opponent.in_game = false;
    games.splice(games.indexOf(game), 1);
    console.log('games:count', games.length)

}

function getLastUserID() {
    var last_user_id = 0;
    for (player of players) {
        if (player.id > last_user_id) {
            last_user_id = player.id
        }
    }
    return last_user_id + 1;
}



function findUser(attr, value) {
    var index = -1;
    var player
    for (var i = 0; i < players.length; i++) {
        player = players[i];
        if (value == player[attr]) {
            index = i; 
            return {
                'index': index,
                'player': player
            }
        }
    }
    return {
        'index': index,
        'player': null
    }
}

function findGame(attr, value) {
    var index = -1;
    var game
    for (var i = 0; i < games.length; i++) {
        game = games[i];
        if (value == game.p1[attr]) {
            return {
                index: index,
                me: game.p1,
                opponent: game.p2
            }
        }
        if (value == game.p2[attr]) {
            return {
                index: index,
                me: game.p2,
                opponent: game.p1
            }
        }

    }
    return {
        'index': index,
        'player': null
    }
}
http.listen(5000, () => {
    console.log('started on port 5000');
});