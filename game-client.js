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


    setInterval(this.draw.bind(this), 1000);

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


    this.board = this._createBoard(100, 100 );
    this.boardEnemy = this._createBoard(500, 100 );
    this.canvas.onmousedown = this._mouseDown.bind(this);
    this.canvas.onmouseup = this._mouseUp.bind(this);

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
    this.ColumnsAndRows = [];
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
    console.log("ceil");
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
    console.log("canvas valid 3", this.canvasValid);

    if (this.canvasValid == false) {
      console.log("draw");

      this.clear(this.ctx);

      this._createBoard();

      this.canvasValid = true;
    }

  };


  Game.prototype._mouseDown = function(e){
    this._getMouse(e);
    this.clear(this.helpCtx);
    var l = this.boats.length;
    for (var i = l-1; i >= 0; i--) {
      // draw shape onto ghost context
      //drawshape(this.helpCanvas, this.boats[i], 'black', 'black');

      // get image data at the mouse x,y pixel
      var imageData = this.helpCtx.getImageData(this.mouse.x, this.mouse.y, 1, 1);
      var index = (this.mouse.x + this.mouse.y * imageData.width) * 4;

      // if the mouse pixel exists, select and break
      if (imageData.data[3] > 0) {
        this.mySel = this.boats[i];
        this.offsetx = this.mouse.x - mySel.x;
        this.offsety = this.mouse.y - mySel.y;
        this.mySel.x = this.mouse.x - offsetx;
        this.mySel.y = this.mouse.y - offsety;
        this.isDrag = true;
        this.canvas.onmousemove = this._mouseMove.bind(this);
        this.invalidate();
        this.clear(this.helpCtx);
        return;
      }

    }
    // havent returned means we have selected nothing
    this.mySel = null;
    // clear the ghost canvas for next time
    this.clear(this.helpCtx);
    // invalidate because we might need the selection border to disappear
    this.invalidate();
  };

  Game.prototype._mouseUp= function(){
    this.isDrag = false;
    this.canvas.onmousemove = null;
  }

  Game.prototype._mouseMove = function(e){
    if (isDrag){
      getMouse(e);

      mySel.x = mx - offsetx;
      mySel.y = my - offsety;

      // something is changing position so we better invalidate the canvas!
      this.invalidate();
    }
  };

  Game.prototype.clear = function(c){
    console.log("what canvas ", c);
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

     console.log("mouse coord", this.mouse);
   };

  Game.prototype.invalidate = function(){
      this.canvasValid = false;
      console.log("canvas valid 222222 ", this.canvasValid);

  }



  var battleShip = new Game();
  battleShip.init();


  window.battleShip = {
  		init: battleShip.init.bind(battleShip)
  }

})(config);
