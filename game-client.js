"use strict";

(function(config){

  var Game = function(){

    this.gameDetails = {
      width : 900,
      height : 500,
      boardWidth: 350,
      boardHeight: 350,
      ceilWidth: 30,
      ceilHeight: 30,
      rows : 6,
      columns: 6,
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

    this.board = {};



    this.ceil = function(){
      return {
        row : "",
        column: 0,
        data: {},
        x: 0,
        y: 0
      }
    };
    this.ColumnsAndRows = [

    ];


  };

  Game.prototype.init = function(){
    console.log("init");
    this.canvas = document.getElementById( 'canvas' );
    this.canvas.width = this.gameDetails.width;
    this.canvas.height = this.gameDetails.height;
    this.ctx = canvas.getContext( '2d' );
    this.board = this._createBoard(100, 100 );
    var board = this._createBoard(300, 100 );
  };

  Game.prototype._generate = function(){
    this.gameDetails.ceilWidth = this.gameDetails.boardWidth / this.gameDetails.columns;
    this.gameDetails.ceilHeight = this.gameDetails.boardHeight / this.gameDetails.rows;
  };

  Game.prototype._createBoard = function(x, y){
    console.log("create board");
    for(var row = 0; row < this.gameDetails.rows; row++){
      for(var column =0; column < this.gameDetails.columns; column++ ){
        var ceil = new this.ceil();
        ceil.row = this.gameDetails.alphabet[row];
        ceil.column = column;
        ceil.x = column * this.gameDetails.ceilWidth;
        ceil.y = row * this.gameDetails.ceilHeight;
        //console.log("new ceil ", ceil, row, column);
        if(!this.ColumnsAndRows[row]){
          this.ColumnsAndRows.push([]);
        }
        this.ColumnsAndRows[row].push(ceil);
        this._drawACeil(x + ceil.x , y + ceil.y, this.gameDetails.ceilWidth, this.gameDetails.ceilHeight, null, '1');
      }
    }
    console.log("columns and rows ", this.ColumnsAndRows);
  };

  Game.prototype._drawACeil = function(x, y, width, height, color, lineWidth){
    this.ctx.lineWidth = lineWidth || '1';
    this.ctx.beginPath();
    this.ctx.rect(x , y, width, height);
    this.ctx.stroke();
  }


  var battleShip = new Game();
  battleShip.init();


  window.battleShip = {
  		init: battleShip.init.bind(battleShip)
  }

})(config);
