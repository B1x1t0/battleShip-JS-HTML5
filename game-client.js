"use strict";

(function(){

  var Game = function(){

    this.gameDetails = {
      width : 600,
      height : 600,
      rows : 3,
      columns: 3,
      alphabet : 'abcdefghijklmnopqrstuvwxyz'.split('')
    };
    this.canvas = {};
    this.ctx = {};
    this.buffer = {};
    this.bufferctx = {};
    this.player = {};
    this.keyPressed = {};
    this.keyMap = {
            left: 37,
            up: 38,
            right: 39,
            down: 40
    };
    this.muouse = {

    }



    this.ceil = function(){
      return {
        width : 0,
        height : 0,
        row : "",
        column: 0
      }
    };
    this.ColumnsAndRows = [

    ];


  };

  Game.prototype.init = function(){
    console.log("init");
    this.canvas = document.getElementById( 'canvas' );
    this.ctx = canvas.getContext( '2d' );
    this._createBoard();
  }

  Game.prototype._createBoard = function(){
    console.log("create board");
    for(var row = 0; row < this.gameDetails.rows; row++){
      for(var column =0; column < this.gameDetails.columns; column++ ){
        var ceil = new this.ceil();
        ceil.row = this.gameDetails.alphabet[row];
        ceil.column = column;
        //console.log("new ceil ", ceil, row, column);
        if(!this.ColumnsAndRows[row]){
          this.ColumnsAndRows.push([]);
        }
        this.ColumnsAndRows[row].push(ceil);
      }
    }
    console.log("columns and rows ", this.ColumnsAndRows);
  }


  var battleShip = new Game();
  battleShip.init();


  window.battleShip = {
  		init: battleShip.init.bind(battleShip)
  }

})();
