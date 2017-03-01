import {Injectable}     from '@angular/core'
import {Http, Response,Headers,RequestOptions} from '@angular/http'

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Event } from '../event'

@Injectable()
export class EventService{
    private eventUrl = 'https://events-api-utilizatorvalid.c9users.io/events'//URL to web API

    constructor(private http: Http){

    }

    getEvents():Observable<Event[]>{
      // const headers: Headers = new Headers();
      // headers.append('Accept', 'application/json');
      // headers.append('Content-Type', 'application/json');
      // headers.append('Access-Control-Allow-Origin', '*');

      //  const options = new RequestOptions({
      //  headers: headers});
       return this.http.get(this.eventUrl)
                       .map(this.extractData)
                       .catch(this.handleError);
    }
    private extractData(res: Response){
        let body = res.json();
        let filtered_events: Event[] = [];
        console.log("extractData")
        let events = body.events
        console.log(events)
        for (let e of events){
	      console.log(e.name)
            filtered_events.push(new Event(
                                  e.id,
                                  e.name,
                                  e.coverPicture,
                                  e.description)
                                  )
        }
        console.log(body)
        return filtered_events || {}
    }
    private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    console.log('error')
    console.log('error')
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}