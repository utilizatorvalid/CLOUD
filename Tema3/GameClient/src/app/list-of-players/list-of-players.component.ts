import { Input, Component, OnInit } from '@angular/core';
import {Player} from '../player'
import {ListOfPlayersService} from './list-of-players.service'

declare var $:any;
declare var swal:any
@Component({
  selector: 'app-list-of-players',
  templateUrl: './list-of-players.component.html',
  styleUrls: ['./list-of-players.component.css'],
  providers: [ ListOfPlayersService ]
})

export class ListOfPlayersComponent implements OnInit {
  @Input() socket:SocketIOClient.Socket
  @Input() player:Player
  connection;
  canChallenge = false;
  count = 0;
  other_players = Array<Player>()
  constructor(private list_player_service: ListOfPlayersService ) {

   }

  ngOnInit() {
    this.connection = this.list_player_service.getPlayers(this.socket).subscribe(data =>{
        console.log(data);
        if(data['type'] == 'exitOne' ){

          let user = data['user']
          let search_player = this.findPlayer(user.id)
          // console.log(search_player)
          if (search_player.index>-1)
          {
            var cbx = $(".pl_"+user.id);
            // console.log(cbx, this.count);
            // console.log(cbx.prop("checked"))
            if(cbx.prop("checked"))
              this.count--
            this.other_players.splice(search_player.index, 1)
            console.log('remove player from other playersdisponible', user)
          }
          
          
          
          // this.other_players.push()
        }
        if(data['type']== 'enterOne' ){
            let user = data['user']
            if(this.player.id != user.id){
              console.log('add player to  playersdisponible', user)
              let new_player = new Player(user.name, user.url_img)
              new_player.id = user.id;
              this.other_players.push(new_player);
            }
            
          
        }
        if(data['type']=='fetchAll'){
          let users = data['users'];
          for(let user of users){
            if(user == null)
              continue;
            if(user.id == this.player.id)
              continue;
              let new_player = new Player(user.name, user.url_img)
              new_player.id = user.id;
              this.other_players.push(new_player);
          }
          
        }
    });
    
  }
  check(event){
    if(event.target.checked)
      this.count++
    else
      this.count--
    
  }
  chalangePlayer(){
    // console.log('challenge');
    var checkboxes = $(".player_checkbox");
    var id_oponent = -1
    for (var cbx of checkboxes){
      //  console.log($(cbx).prop("checked"))
       if($(cbx).prop("checked"))
          id_oponent = parseInt($(cbx).prop('id'));
    }
    this.socket.emit("game_invite",{
      invite_from: this.player.id,
      invite_to:id_oponent
    });
  }
  findPlayer(id){
    var index = -1;
    var player
    for (var i = 0; i < this.other_players.length; i++) {
        player = this.other_players[i];
        if (player.id == id) {
            index = i;
            console.log(index)
            break
        }
    }
    return {
        'index': index,
        'player': player
    }
  }
  ngOnDestroy(){
      this.connection.unsubscribe();
  }

}
