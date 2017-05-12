import { Component, EventEmitter, AfterViewInit, Input, Output,Injectable } from '@angular/core';
import {  } from "";
import {Player} from '../player'

declare var $:any;
declare var Materialize:any;
@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
@Injectable()
export class JoinComponent {
@Input() player;
@Output() playerChange: EventEmitter<any>;
personages = [
    new Player("Batman",'../../assets/batman.jpg'),
    new Player("Joker", '../../assets/joker.jpg'),
    new Player("Harley Quinn", '../../assets/harley.jpg'),
    new Player("Aquaman", '../../assets/aquaman.jpg')
  ]
  constructor() { 
    this.player;
    this.playerChange = new EventEmitter<any>();  
  }
   

  ngOnInit() {
  }

  public getPlayerInfo(){
    
  }

  submitForm(){
    var p:Player;
    console.log("selection",$("#characterSelect").val())
    if(!$("#characterSelect").val()){
      Materialize.toast('Please select your character!', 2000, 'red');
      return;
    }
    if(! $("#playername").val()){
      Materialize.toast('Please pick a name!', 2000, 'red');
      return;
    }
    p = this.personages[$("#characterSelect").val()]
    p.name = $("#playername").val()
    // var data = {
    //   name :$("#playername").val(),
    //   url_img: this.personages[$("#characterSelect").val()].url_img
    // };
    // this.player = data;
    this.player = p;
    console.log('subbmit')
    
    this.playerChange.emit(this.player);
      
  }
  
  
  ngAfterViewInit():void{
    $('select').material_select();
  }

}
