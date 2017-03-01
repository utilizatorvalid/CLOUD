import { Component, Input } from "@angular/core"
import { Event } from './event'
@Component({
    selector:'event',
    templateUrl:'app/templates/event.html',
    styles : [`.event-card {
                width: 400px;
                }

                .example-header-image {
                background-image: url('assets/img/examples/shiba1.jpg');
                background-size: cover;
                }           
                `]
})
export class AppEventComponent{
    @Input()
    event: Event
}