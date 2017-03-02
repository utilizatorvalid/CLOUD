import { Component, OnInit} from '@angular/core'
import { Event } from './event'
import { EventService } from './event.service'
@Component({
    selector: 'event-list',
    templateUrl:'./templates/event-list.component.html',
    providers: [ EventService ],
    styleUrls: ['./styles/event-list.component.css' ]
})

export class EventListComponent implements OnInit { 
  title = "Lista de evenimente"
  errorMessage:string;
  events: Event[]
  mode = 'Observable';
  constructor (private eventService: EventService) {}

  ngOnInit(){
    this.getEvents();
  }  

  getEvents(){
    // console.log("sadlaskjdha")
    this.eventService.getEvents()
                      .subscribe(
                        events=> this.events = events,
                        error => this.errorMessage = <any> error
                      );
  }
}  