import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {ChatService} from './chat.service'
import {Player} from '../player'
declare var $:any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() socket;
  @Input() player:Player;
  messages = [];
  connection;
  id_getter;
  message;
  chat_visibility = false;

  constructor(private chatService:ChatService) { 
    this.player  = new Player('unknown','some-pic');
  }

  sendMessage(){
    this.chatService.sendMessage({id:  this.player.id,
                                  text: this.message
                                });
    this.message = ''
  }
  ngOnInit() {
    this.connection = this.chatService.getMessages(this.socket).subscribe(message =>{
      console.log(message)
      this.messages.push(message);
    })
    this.id_getter = this.chatService.getMy_ID(this.socket).subscribe(data=>{
      this.player.id = data['id'];
    })    
    this.socket.on("clear_message",(data)=>{
      this.messages = [];
    })
  }
  
  ngOnDestroy(){
      // this.connection.unsubscribe();
      // this.id_getter.unsubscribe();
  }

}
