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





    this.Boat = function(size,x,y,orientation,img, w, h){
      this.size =  size || 3;
      this.img = {};
      this.x = x || 0;
      this.y = y || 0;
      this.w = w;
      this.h = h * size;
      this.orientation = orientation || 'vertical';
      this.startX = 0;
      this.startY = 0;
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
    this.ColumnsAndRowsEnemy = [
    ];

    this.isDrag = false;
    this.canvasValid = false;
    this.mySel = {};
    this.offsetx = {};
    this.offsety = {};

    // Padding and border style widths for mouse offsets
    this.stylePaddingLeft = {};
    this.stylePaddingTop = {};
    this.styleBorderLef= {};
    this.styleBorderTop = {};


    setInterval(this.draw.bind(this), 5);

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
    this.helpCtx = canvas.getContext( '2d' );


    this.board = this._createBoard(0, 0);
    this.boardEnemy = this._createBoard(500, 100);
    this.canvas.onmousedown = this._mouseDown.bind(this);
    this.canvas.onmouseup = this._mouseUp.bind(this);

    var boat = new this.Boat(3,10,10,0,'vertical',8, 8);
    this.boats.push(boat);
    this._drawBoats();

    this._drawABoard(0,0, this.board);
    this._drawABoard(500,100, this.boardEnemy);

    //this.canvas.onmouseup = this._mouseUp.bind();
    //this.canvas.ondblclick = myDblClick;
  };

  Game.prototype._generate = function(){
    this.gameDetails.ceilWidth = this.gameDetails.boardWidth / this.gameDetails.columns;
    this.gameDetails.ceilHeight = this.gameDetails.boardHeight / this.gameDetails.rows;
  };

  Game.prototype._createBoard = function(x, y){
    var board = [];
    for(var row = 0; row < this.gameDetails.rows; row++){
      for(var column =0; column < this.gameDetails.columns; column++ ){
        var ceil = new this.Ceil();
        ceil.row = this.gameDetails.alphabet[row];
        ceil.column = column;
        ceil.x = column * this.gameDetails.ceilWidth + x;
        ceil.y = row * this.gameDetails.ceilHeight + y;
        board.push(ceil);
      }
    }
    return board;
  };

  Game.prototype._drawBoats = function(){
    for(var i = 0; i<this.boats.length; i++){
      this._drawABoat(this.boats[i].x, this.boats[i].y, this.boats[i].size, this.boats[i].rotation, this.boats[i].w, this.boats[i].h)
    }
  }

  Game.prototype._drawACeil = function(x, y, width, height, color, lineWidth){
    this.ctx.lineWidth = lineWidth || '1';
    this.ctx.beginPath();
    this.ctx.rect(x , y, width, height);
    this.ctx.stroke();
  };

  Game.prototype._drawABoard = function(x, y, board){
    for(var ceil = 0; ceil < board.length; ceil++){
        this._drawACeil(board[ceil].x ,  board[ceil].y, this.gameDetails.ceilWidth, this.gameDetails.ceilHeight, null, '1');
    }
  };


  Game.prototype._drawABoat = function(x, y, size , rotation, w, h){
    this.ctx.lineWidth =  '1';
    this.ctx.beginPath();
    this.ctx.color = 'rgb(33,67,31)';
    this.ctx.rect(x , y, w, h * size);
    this.ctx.fill();
  };

  Game.prototype.draw = function(){

    if (this.canvasValid == false) {

      this.clear(this.ctx);

      this._drawABoard(0,0, this.board);
      this._drawABoard(500,100, this.boardEnemy);
      this._drawBoats();


      this.canvasValid = true;
    }

  };


  Game.prototype._mouseDown = function(e){
    this._getMouse(e);
    this.clear(this.helpCtx);
    var l = this.boats.length;
    console.log(this.boats, this.boats.length);
    for (var i = l-1; i >= 0; i--) {
      // draw shape onto ghost context
      console.log("boooooatsss ",this.boats[i]);
      this.drawshape(this.helpCtx, this.boats[i], 'red', 'black');

      // get image data at the mouse x,y pixel
      var imageData = this.helpCtx.getImageData(this.mouse.x, this.mouse.y, 1, 1);
      console.log(imageData);
      var index = (this.mouse.x + this.mouse.y * imageData.width) * 4;

      // if the mouse pixel exists, select and break
      if (imageData.data[3] > 0) {
        this.mySel = this.boats[i];
        console.log("SELECTION",this.mySel);
        this.offsetx = this.mouse.x - this.mySel.x;
        this.offsety = this.mouse.y - this.mySel.y;
        this.mySel.x = this.mouse.x - this.offsetx;
        this.mySel.y = this.mouse.y - this.offsety;
        this.isDrag = true;
        this.canvas.onmousemove = this._mouseMove.bind(this);
        this.boats[i] = this.mySel;
        console.log("MI NUEVO BARCO ", this.boats[i]);

        this.invalidate();
        this.clear(this.helpCtx);
        return;
      }

    }
    // havent returned means we have selected nothing
    this.boatz[i] = this.mySel;
    this.mySel = null;
    // clear the ghost canvas for next time
    this.clear(this.helpCtx);
    // invalidate because we might need the selection border to disappear
    this.invalidate();
  };


  Game.prototype.drawshape = function(context, shape, fill) {
      //context.fillStyle = fill;
      console.log("DRAW SHAPE");
      this.mouse.x = shape.x;
      this.mouse.y = shape.y;

      console.log("MI BOAT", shape);

    // We can skip the drawing of elements that have moved off the screen:
    if (shape.x > this.gameDetails.width || shape.y > this.gameDetails.height ||
        shape.x + shape.w < 0 || shape.y + shape.h < 0) {
            if (shape.rotation != 0) { context.restore(); }

      return;
    }

    context.fillRect(this.mouse.x,this.mouse.y,shape.w,shape.h);
    if (shape.rotation != 0) { context.restore(); }
  }


  Game.prototype._checkBoatInCell = function(boat){
    var posX = boat.x;
    var posY = boat.y;
    var maxX = boat.orientation == 'horizontal'? this.gameDetails.ceilWidth * boat.size + boat.x: boat.x;
    var maxY = (boat.orientation == 'vertical') ? (this.gameDetails.ceilHeight * (boat.size- 1))+ boat.y : boat.y;

    for(var i = 0;i<this.board.length; i++){
      var ceil = this.board[i];
      if(posX >= ceil.x && posX < (ceil.x + this.gameDetails.ceilWidth) &&
          posY >= ceil.y && posY <(ceil.y + this.gameDetails.ceilHeight)){

        //console.log("Está en la celda ", i, maxX, maxY);
        /*for(var j = 0;j<this.board.length; j++){
          var lastCeil = this.board[j];
          if(maxX >= lastCeil.x && maxX < (lastCeil.x + this.gameDetails.ceilWidth) &&
              maxY >= lastCeil.y && maxY <(lastCeil.y + this.gameDetails.ceilHeight)){
                console.log("Barco ENTERO", j);

              }
        }*/
        var lastCeil = this.board[i + ((boat.size - 1) * 10)];
        console.log(i + ((boat.size - 1) * 10));
        if(lastCeil){
          console.log("x   ",maxX, lastCeil.x, lastCeil.x + this.gameDetails.ceilWidth );
          console.log("y   ",maxY, lastCeil.y, lastCeil.y+ this.gameDetails.ceilHeight );
          if(maxX >= lastCeil.x && maxX < (lastCeil.x + this.gameDetails.ceilWidth) &&
             maxY >= lastCeil.y && maxY <(lastCeil.y + this.gameDetails.ceilHeight)
            ){
                console.log("Barco ENTERO", i);

              }

          }
       }
    }
  }


  Game.prototype._mouseUp= function(){
    this.isDrag = false;
    this.canvas.onmousemove = null;
  }

  Game.prototype._mouseMove = function(e){
    if (this.isDrag){
      this._getMouse(e);
      this.mySel.x = this.mouse.x - this.offsetx;
      this.mySel.y = this.mouse.y - this.offsety;
      this._checkBoatInCell(this.mySel);
      // something is changing position so we better invalidate the canvas!
      this.invalidate();
    }
  };

  Game.prototype.clear = function(c){
      c.clearRect(0, 0, this.gameDetails.width, this.gameDetails.height);
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

     //console.log("mouse coord", this.mouse);
   };

  Game.prototype.invalidate = function(){
      this.canvasValid = false;
  }

  var battleShip = new Game();
  battleShip.init();


  window.battleShip = {
  		init: battleShip.init.bind(battleShip)
  }

})(config);
