import { Input, Component, OnInit } from '@angular/core';
import {Player} from '../player'
declare var $:any;
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
@Input() socket:SocketIOClient.Socket;
@Input() me:Player;
@Input() opponent:Player;
my_turn :boolean;
  constructor() { }

  ngOnInit() {
    console.log("start");
    console.log(this.me,'\n vs\n',this.opponent);
    new Game('#game-container', '#game-template', this)
    
    this.socket.on('activePlayer',(data)=>
    {
      if(data.active_player.id == this.me.id)
        this.my_turn = true;
    });
    this.socket.on('changeBoard',(data)=>{
        //SET ACTIVE Player
        //IF IT'S NOT ME THEN I STAY CALM :d
    });
  }
  endGame(){
    this.socket.emit("game_end",{
      me: this.me,
      opponent: this.opponent

    });
  }
  changeBoard(){
    this.socket.emit('move',this.me);
  }

}
var  Game = function(element, template, sup){
  this.sup = sup;
  this.element = $(element);
  this._template = template;
  
  this.init =function(){
    this.over = false;
    this.moves = 0;
    this._winPiece = [];
    this.startTime = Date.now();
    this.endTime = Date.now(); // reset this latter
    this.Player = [];
    this.Board = null;
    this.activePlayer = (this.sup.my_turn)? 0 : 1; // current active player (index of this.players)
    this.updateMovesCount();
    this.maxThemes = 4;

    if (!this.template){
      this.template = $(this._template).html()
      this.element.append(this.template)
      this.bindEvents()

      // store theme in cookie
    }
  }

  this.bindEvents = function(){
    var self = this;

       $('#restart', this.element).click(function(e){
      e.preventDefault();
      if (self.moves < 1) return;
      self.hideMenu()
      $('td.X, td.O', this.element).addClass('animated zoomOut')
      setTimeout(function(){
        self.restart();
      }, 750);
    });

    // bind input actions
    $('#game tr td', this.element).click(function(el, a, b){
      if(self.over) return;
      var col = $(this).index();
      var row = $(this).closest('tr').index();
      self.move( row +' '+ col );
      self.showMenu()
    });

    $('#game tr td', this.element).hover(function(){
      if(self.over) return;
      $(this).addClass('hover-'+ self.activePlayer);
    }, function(){
      if(self.over) return;
      $(this).removeClass('hover-0 hover-1');
    })

    // reset the td.X|O elements when css animations are done
    $(this.element).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 'td.X', function(){
      $(this).attr('class', 'X')
    });

    $(this.element).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 'td.O', function(){
      $(this).attr('class', 'O')
    });

  }

  this.start = function(){
    this.hideMenu();
    this.init();
    // console.log('Starting Game');
    $('#game tr td').attr('class', '');
    $('#status').removeClass('show');
    // create two players
    this.Player.push( new Player1(this.sup.me, null, this.sup.me.symbol ) );
    this.Player.push( new Player1(this.sup.opponent, null, this.sup.opponent.symbol) );
    this.Board = new Board();
    this.Board.update();
    // set this.startTime
    this.startTime = Date.now();

    // this.timer();
  };

  this.showMenu = function(){
    $('#menu').attr('class', '')
  }

  this.hideMenu = function(){
    $('#menu').attr('class', 'hidden')
  }

  this.restart = function(){
    clearInterval( this.timerHandle );
    this.start();
  }


  // this.timer = function(){
  //   var self = this;
  //   var then = self.startTime;
  //   var format = function(now, then){
  //     return Date.create(then).relative();
  //   };
  //   this.timerHandle = setInterval(function(){
  //     var now = Date.now();
  //     $('#time').text( format(now, then) );
  //   }, 500);
  // };


  /**
   * Parse a users move input string, e.g. '1 2'
   * 
   * @param  {string} v An input string representing a move in the format 'row col'
   * @return {object}   row, col, and index (the index on the game board)
   */
  this.parseInput = function(v){
    v = v.split(' ');
    var pos = Number(v[1]);
    if(v[0] == 1) pos = (pos+3);
    if(v[0] == 2) pos = (pos+6);
    return {
      row: v[0],
      col: v[1],
      index: pos
    };
  };

  /**
   * Attempt to make a move, basically is it 'possible'
   * 
   * @param  {number} input the index to move to
   * @return {boolean}      
   */
  this.tryMove = function(input){
    if(this.Board.board[input] == '_') return true;
    return false;
  };

  /**
   * Make a move as the active player
   * 
   * @param  {string} v An input string, eg: '1 1'
   * @return {boolean}   return false if we are unable to make the move
   */
  this.move = function(v){
    var Player = this.Player[ this.activePlayer ];
    v = this.parseInput(v);
    if(!this.tryMove(v.index)) return false;

    // console.log('%s: %s, %s', Player.symbol, v.row, v.col);

    Player.moves.push( v.index );
    this.moves++;
    this.Board.board[v.index] = Player.symbol;
    this.activePlayer = (Player._id) ? 0 : 1; // inverse of Player._id
    // update our board.
    this.Board.update();

    this.updateMovesCount();

    // a player has won!
    if(this.hasWon(Player)){
      this.gameOver(Player);
      return true;
    }

    // draw!
    if(this.moves >= 9) this.gameOver(null)

    return true;
  };

  this.gameOver = function(Player){
    if (!Player){
      $('td.X, td.O', this.element).addClass('animated swing')
      return $('#status').text('It\'s a Draw!').addClass('show');
    }

    // only animate the winning pieces!
    var elements = '';
    for(var i=0; i<this._winPiece.length; i++){
      var p = this._winPiece[i]
      if (p < 3){
        elements += 'tr:eq(0) td:eq('+ p +'),';
      } else if( p < 6){
        elements += 'tr:eq(1) td:eq('+ (p-3) +'),';
      } else {
        elements += 'tr:eq(2) td:eq('+ (p-6) +'),';
      }
    }
    elements = elements.slice(0, - 1); // trim last character
    console.log("element", elements)
    var x = $( elements ).addClass('animated rubberBand')

    $('#status').text('Player '+ Player.symbol +' Wins!').addClass('show');
    this.over = true;

  }

  /**
   * Check if the player has won
   * @param  {Player}  Player the player
   * @return {Boolean}
   */
  this.hasWon = function(Player){
    var won = false;
    var wins = Player.moves.join(' ');
    var self = this;
    console.log("from Game")
    console.log(this.Board.wins, wins)
    for (var n of this.Board.wins){
      if(wins.indexOf(n[0])!=-1 && wins.indexOf(n[1])!=-1 && wins.indexOf(n[2])!=-1){
        won = true;
        self._winPiece = n;
        return true;
      }
    };
    return won;
  };

  this.updateMovesCount = function(){
    $('#time').text('Moves: '+ this.moves );
  }


  //
  // Start the game
  //
  this.start()

}




/**
 * Player Object
 */
var Player1 = function(id, computer, symbol){
  this._id = id;
  this.symbol = symbol;
  this.computer = (computer) ? computer : true; // default to computer user
  this.moves = [];
};



/**
 * Board Object
 */
var Board = function(){
  // empty board (3x3)
  this.board = [
    '_','_','_',
    '_','_','_',
    '_','_','_'
  ];

  // array of possible win scenarios
  this.wins = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6],
    [1,4,7], [2,5,8], [0,4,8], [2,4,6]
  ];

  this.update = function(){
    var board = this.board;
    $('#game tr').each(function(x, el){
      $('td', el).each(function(i, td){
        var pos = Number(i);
        if(x == 1) pos = (pos+3);
        if(x == 2) pos = (pos+6);
        var txt = (board[pos] == '_') ? '' : board[pos];
        $(this).html( txt ).addClass( txt );
      });
    });
  };

};