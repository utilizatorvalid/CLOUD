import { Component, OnInit } from '@angular/core';
import {ChatComponent} from '../chat/chat.component'
import {JoinComponent} from '../join/join.component'
import {ListOfPlayersComponent} from '../list-of-players/list-of-players.component'

import {Player} from '../player'
import * as io from 'socket.io-client'
declare var $:any;
declare var swal:any;
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  private url = 'http://localhost:5000'
  private socket:SocketIOClient.Socket;
  player:Player;
  opponent: Player;
  
  constructor() { 
     this.player  = new Player('unknown','some-pic');
  }

  ngOnInit() {
    this.socket = io(this.url);
    this.socket.on('game_invite_res',(data)=>{
      console.log(data);
      this.player.in_game=false;

    });
    this.socket.on('game_invite',(data)=>{
    
      if(this.player.in_game)
        return;
        swal({
          title:'Game Invite?',
          text:'Accept invite from: '+data.invite_from.name,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!',
          type:'question'
        }).then( ()=> {
            //send to user accept and gameinit
            // remove from available users 
            console.log("ACCEPT INVITATION")
            console.log(this);
            this.socket.emit('accept_invite',{me: this.player});
            //this.player.in_game = true;
            

            
          }, (dismiss)=> {
            // dismiss can be 'cancel', 'overlay',
            // 'close', and 'timer'
            if (dismiss === 'cancel') {
                // send to user reject and delete game
                console.log("REJECT INVITATION")
                console.log(this)
                this.socket.emit('reject_invite',{me:this.player});  
            }

          })
        console.log(data);
    })
    this.socket.on('start_game',(data)=>{
      this.setGameStatus(true)
      console.log('start_game');
      console.log(data);
      this.opponent = new Player(data.opponent.name,data.opponent.url_img)
      this.opponent.id = data.opponent.id;
      
      this.opponent.symbol = data.opponent.symbol
      this.player.symbol =(data.opponent.symbol =='X') ? 'O' :'X' ;
      
    })
    this.socket.on('reject_invite',(data)=>{
      this.setGameStatus(false)

      //this.player.in_game = false;
    })
    this.socket.on('end_game',(data)=>{
      this.setGameStatus(false)
      console.log("end_game", this.player.in_game);
      $("#player_panel").show();

    })
  }
  setGameStatus(in_game){
    var player_board = $("#player_panel")
    var chat = $("#chat");
    if(in_game)
    {
      player_board.hide()
      chat.show()
    }
    else
    {
      player_board.show()
      chat.hide();
    }
    this.player.in_game = in_game

  }
  onPlayerChanged(player) {
    this.player.name = player.name;
    this.player.url_img = player.url_img;
    this.socket.emit('player_updata', this.player)
    $("#join").hide()


  }

}
