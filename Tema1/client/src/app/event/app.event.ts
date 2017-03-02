import { Component, Input } from "@angular/core"
import { Event } from './event'
@Component({
    selector:'event',
    templateUrl: './templates/app.event.html',
    styleUrls : [`./styles/app.event.css`]
})
export class AppEventComponent{
    @Input()
    event: Event
}