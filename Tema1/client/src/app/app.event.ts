import { Component, Input } from "@angular/core"
import { Event } from './event'
@Component({
    selector:'event',
    templateUrl:'app/templates/event.html',
    styles : [`.event-card {
                display: inline-block;
                width: 400px;
                height: 400px;
                margin: 1em;
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