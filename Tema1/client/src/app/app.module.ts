
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule} from '@angular/http'
import { MaterialModule } from '@angular/material'
// import { MaterializeModule } from "../src/index";
// import { MaterializeModule } from 'angular2-materialize'
import { AppComponent }  from './app.component';
import { AppEventComponent }      from './app.event'
import { EventListComponent }        from './toh/event-list.component';

@NgModule({
  imports:      [ BrowserModule,
                  HttpModule, 
                  JsonpModule,
                  MaterialModule
                ],
  declarations: [ AppComponent, 
                  AppEventComponent,
                  EventListComponent
                ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
