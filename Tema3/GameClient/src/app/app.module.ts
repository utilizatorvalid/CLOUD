import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { ListOfPlayersComponent } from './list-of-players/list-of-players.component';
import { JoinComponent } from './join/join.component';
import { BoardComponent } from './board/board.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ListOfPlayersComponent,
    JoinComponent,
    BoardComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterializeModule
  ],
  providers: [JoinComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
