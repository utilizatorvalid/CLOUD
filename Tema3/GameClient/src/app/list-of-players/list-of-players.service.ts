import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject'
import{Observable} from 'rxjs/Observable'
@Injectable()
export class ListOfPlayersService {
  private socket:SocketIOClient.Socket;
  constructor() { }
  getPlayers(socket){
    this.socket = socket;
    let observable = new Observable(observer =>{
      this.socket.on('new_player_enter',(data)=>{
          data['type']= 'enterOne';
          observer.next(data);
      });
      this.socket.on('player_offline',(data)=>
      {
        data['type'] = 'exitOne'
        observer.next(data) 
      })
      this.socket.on("all_players", (data)=>{
        data['type'] = 'fetchAll'
        observer.next(data);
      })
      return ()=>{
        this.socket.disconnect();
      }
    });
    return observable;
  }
}
