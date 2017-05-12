import { Injectable } from '@angular/core';
import{Observable} from 'rxjs/Observable'

@Injectable()
export class ChatService {
  private socket;
  
  sendMessage(message){
    this.socket.emit('add-message', message)
  }

  getMessages(socket){
    this.socket = socket
    let observable = new Observable(observer =>{
      this.socket.on('message',(data)=>{
          observer.next(data)
      });
      return ()=>{
        this.socket.disconnect();
      }
    })
    return observable
  }
  getMy_ID(socket){
    let observable = new Observable(observer =>{
      this.socket.on('new_id',(data)=>{
          console.log(data)
          observer.next(data)
      });
      return ()=>{
        this.socket.disconnect();
      }
    })
    return observable
  }

  constructor() { }

}
