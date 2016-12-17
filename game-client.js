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
      rows : 10,
      columns: 10,
      alphabet : 'abcdefghijklmnopqrstuvwxyz'.split('')
    };
    this.canvas = {};
    this.helpCanvas = {};
    this.ctx = {};
    this.helpCtx = {};
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
    this.mouse = {
      x:0,
      y:0

    }

    this.board = {};
    this.boardEnemy = {};
    this.boats = [];





    this.Boat = function(size,x,y,orientation,img){
      this.size =  size || 3;
      this.img = {};
      this.x = x || 0;
      this.y = y || 0;
      this.orientation = orientation || 0;
    };

    this.Boat.prototype.getPato = function(){
      return this;
    }

    this.Ceil = function(){
        this.row =  "";
        this.column = 0;
        this.data = {};
        this.x = 0;
        this.y = 0;
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

    this.helpCanvas = document.getElementById( 'canvas' );
    this.helpCanvas.width = this.gameDetails.width;
    this.helpCanvas.height = this.gameDetails.height;
    this.gelpCtx = canvas.getContext( '2d' );


    this.board = this._createBoard(100, 100 );
    this.boardEnemy = this._createBoard(500, 100 );
    this.canvas.onmousedown = this._mouseDown.bind(this);
    var boat = new this.Boat(3,10,10,0,null);
    this.boats.push(boat);
    this._createBoats();
    //this.canvas.onmouseup = this._mouseUp.bind();
    //this.canvas.ondblclick = myDblClick;
  };

  Game.prototype._generate = function(){
    this.gameDetails.ceilWidth = this.gameDetails.boardWidth / this.gameDetails.columns;
    this.gameDetails.ceilHeight = this.gameDetails.boardHeight / this.gameDetails.rows;
  };

  Game.prototype._createBoard = function(x, y){
    console.log("create board");
    for(var row = 0; row < this.gameDetails.rows; row++){
      for(var column =0; column < this.gameDetails.columns; column++ ){
        var ceil = new this.Ceil();
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

  Game.prototype._createBoats = function(){
    for(var i = 0; i<this.boats.length; i++){
      this._drawABoat(this.boats[i].x, this.boats[i].y, this.boats[i].size, this.boats[i].rotation)
    }
  }

  Game.prototype._drawACeil = function(x, y, width, height, color, lineWidth){
    this.ctx.lineWidth = lineWidth || '1';
    this.ctx.beginPath();
    this.ctx.rect(x , y, width, height);
    this.ctx.stroke();
  };


  Game.prototype._drawABoat = function(x, y, size , rotation){
    this.ctx.lineWidth =  '1';
    this.ctx.beginPath();
    this.ctx.color = 'rgb(33,67,31)';
    this.ctx.rect(x , y, this.gameDetails.ceilWidth, this.gameDetails.ceilWidth * size);
    this.ctx.fill();
  };

  Game.prototype.draw = function(){

  };

 Game.prototype._getMouse = function(e){
    var element = canvas, offsetX = 0, offsetY = 0;

    if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    //
    this.mouse.x = e.pageX - offsetX;
    this.mouse.y = e.pageY - offsetY;

    console.log("mouse coord", this.mouse);
  }

  Game.prototype._mouseDown = function(e){
    this._getMouse(e);
    /*clear(gctx);
    var l = boxes.length;
    for (var i = l-1; i >= 0; i--) {
      // draw shape onto ghost context
      drawshape(gctx, boxes[i], 'black', 'black');

      // get image data at the mouse x,y pixel
      var imageData = gctx.getImageData(mx, my, 1, 1);
      var index = (mx + my * imageData.width) * 4;

      // if the mouse pixel exists, select and break
      if (imageData.data[3] > 0) {
        mySel = boxes[i];
        offsetx = mx - mySel.x;
        offsety = my - mySel.y;
        mySel.x = mx - offsetx;
        mySel.y = my - offsety;
        isDrag = true;
        canvas.onmousemove = myMove;
        invalidate();
        clear(gctx);
        return;
      }

    }
    // havent returned means we have selected nothing
    mySel = null;
    // clear the ghost canvas for next time
    clear(gctx);
    // invalidate because we might need the selection border to disappear
    invalidate();*/
  };




  var battleShip = new Game();
  battleShip.init();


  window.battleShip = {
  		init: battleShip.init.bind(battleShip)
  }

})(config);
