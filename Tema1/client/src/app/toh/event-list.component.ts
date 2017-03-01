import { Component, OnInit} from '@angular/core'
import { Event } from '../event'
import { EventService } from './event.service'
@Component({
    selector: 'event-list',
    template:`
            <h1>{{title}}</h1>
            <ul>
              <li *ngFor = "let event of events">
                <event [event]="event"></event>
              </li>
            </ul>
            <p class="error" *ngIf="errorMessage">{{errorMessage}}</p>`
            ,
    providers: [ EventService ],
    styles: ['.error {color:red;}']
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