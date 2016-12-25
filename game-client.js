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

    this.Boat = function(size,x,y,orientation,img, w, h,id){
      this.id = id;
      this.size =  size || 3;
      this.img = {};
      this.x = x || 0;
      this.y = y || 0;
      this.w = w;
      this.h = h;
      this.width = w;
      this.height = h;
      this.orientation = orientation || 'vertical';
      this.startX = x;
      this.startY = y;
      this.data = {
        ceils: []
      };
    };

    this.Button = function(x,y, w, h, type, img){
      this.img = {};
      this.x = x || 0;
      this.y = y || 0;
      this.w = w;
      this.h = h;
      this.type = type || null;
      this.fun = function(boat){
        boat.orientation = boat.orientation == 'vertical'? 'horizontal': 'vertical';
      }
    };

    this.buttons = [];



    this.Ceil = function(){
        this.row =  "";
        this.column = 0;
        this.data = {
          ceils: []
        };
        this.x = 0;
        this.y = 0;
        this.boat = false;
    };



    this.ColumnsAndRows = [
    ];
    this.ColumnsAndRowsEnemy = [
    ];

    this.isDrag = false;
    this.canvasValid = false;
    this.mySel = {};
    this.myLastSel = {};
    this.offsetx = {};
    this.offsety = {};
    this.isPossibleInCeil = false;
    this.isPossibleBoat = false;
    this.ceilsInBoat = [];
    this.lastCeilsInBoat = [];

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


    this.board = this._createBoard(100, 100);
    this.boardEnemy = this._createBoard(500, 100);
    this.canvas.onmousedown = this._mouseDown.bind(this);
    this.canvas.onmouseup = this._mouseUp.bind(this);
    this.canvas.onclick = this._onClickAction.bind(this);

    var boat = new this.Boat(3,10,10,0,'vertical',28, 28,1);
    var boat2 = new this.Boat(2,10,200,0,'vertical',28, 25,2);

    var buttonOrientation = new this.Button(200,400,50,30,'orientation',null);
    this.buttons.push(buttonOrientation);
    this.boats.push(boat2);
    this.boats.push(boat);
    this._drawBoats();
    this._drawButtons();
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
      var boat = this.boats[i];
      //console.log(boat);

      boat.w = (boat.orientation == 'vertical') ? boat.width : boat.width * boat.size;
      boat.h = (boat.orientation == 'vertical') ? boat.height * boat.size : boat.height;
      //console.log(boat);
      this._drawABoat(boat.x, boat.y, boat.w, boat.h)
    }
  }

  Game.prototype._drawButtons = function(){
    for(var i = 0; i<this.buttons.length; i++){

      this._drawAButton(this.buttons[i].x, this.buttons[i].y, this.buttons[i].w, this.buttons[i].h, this.buttons[i].img, 'rgb(0,255,0)')
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


  Game.prototype._drawABoat = function(x, y, w, h){
    this.ctx.lineWidth =  '1';
    this.ctx.beginPath();
    this.ctx.fillColor = 'rgb(33,67,31)';
    this.ctx.rect(x , y, w, h);
    this.ctx.fill();
  };

  Game.prototype._drawAButton = function(x, y, w, h, img, fill){
    this.ctx.lineWidth =  '1';
    this.ctx.beginPath();
    this.ctx.fillColor = fill;
    this.ctx.rect(x , y, w, h);
    this.ctx.fill();
  };

  Game.prototype.draw = function(){

    if (this.canvasValid == false) {

      this.clear(this.ctx);

      this._drawABoard(0,0, this.board);
      this._drawABoard(500,100, this.boardEnemy);
      this._drawBoats();
      this._drawButtons();


      this.canvasValid = true;
    }

  };


  Game.prototype._onClickAction = function(e){

    this._getMouse(e);
    var l = this.buttons.length;
    //console.log(this.boats, this.boats.length);
    for (var i = l-1; i >= 0; i--) {
      // draw shape onto ghost context
      if(this._clickOnButton(this.buttons[i])){
        var button = this.buttons[i];
        button.fun(this.myLastSel);
        console.log(this.mySel, this.myLastSel);
        this._checkBoatInCell(this.myLastSel);
        this.invalidate();
      }

    }

  };


  Game.prototype._mouseDown = function(e){

    this._getMouse(e);
    this.clear(this.helpCtx);
    var l = this.boats.length;
    //console.log(this.boats, this.boats.length);
    for (var i = l-1; i >= 0; i--) {
      // draw shape onto ghost context
      if(this._clickOnBoat(this.boats[i])){
        console.log("draw" , this.boats[i]);
          this.drawshape(this.helpCtx, this.boats[i], 'red', 'black');

          // get image data at the mouse x,y pixel
          var imageData = this.helpCtx.getImageData(this.mouse.x, this.mouse.y, 1, 1);
          //console.log(imageData, imageData.data[3]);
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
            this.invalidate();
            this.clear(this.helpCtx);
            return;
          }
      }

    }
    // havent returned means we have selected nothing
    //this.boatz[i] = this.mySel;
    this.mySel = null;
    // clear the ghost canvas for next time
    this.clear(this.helpCtx);
    // invalidate because we might need the selection border to disappear
    this.invalidate();
  };

  Game.prototype._clickOnBoat = function(boat){
    if(this.mouse.x > boat.x && this.mouse.x < (boat.x + boat.w) &&
      this.mouse.y > boat.y && this.mouse.y < (boat.y + boat.h)){
        return true
      }else{
        return false;
      }
  }

  Game.prototype._clickOnButton = function(button){
    if(this.mouse.x > button.x && this.mouse.x < (button.x + button.w) &&
      this.mouse.y > button.y && this.mouse.y < (button.y + button.h)){
        return true
      }else{
        return false;
      }
  }



  Game.prototype.drawshape = function(context, shape, fill) {
      //context.fillStyle = fill;
      //console.log("DRAW SHAPE");
      this.mouse.x = shape.x;
      this.mouse.y = shape.y;
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
    this.isPossibleBoat = false;

    var maxX = boat.orientation == 'horizontal'? (this.gameDetails.ceilWidth * (boat.size- 1)) + boat.x: boat.x;
    var maxY = (boat.orientation == 'vertical') ? (this.gameDetails.ceilHeight * (boat.size- 1))+ boat.y : boat.y;


    for(var i = 0;i<this.board.length; i++){
      var ceil = this.board[i];
      if(posX >= ceil.x && posX < (ceil.x + this.gameDetails.ceilWidth) &&
          posY >= ceil.y && posY <(ceil.y + this.gameDetails.ceilHeight)){



              var lastPosition = (boat.orientation == 'vertical') ? i + ((boat.size - 1) * 10) : i + (boat.size - 1);
              //this.isPossibleInCeil = true;
              //this.isPossibleBoat = false;
              var count = 1;
              var boatInBoard = false;
              this.ceilsInBoat = [];
              var sum = (boat.orientation == 'vertical') ? this.gameDetails.columns : 1;
              for(var pos = i; pos<= lastPosition; pos=pos+sum){
                this.ceilsInBoat.push(pos);
                var lastCeil = this.board[pos];
                if(lastCeil && maxX >= lastCeil.x && maxX < (lastCeil.x + this.gameDetails.ceilWidth) &&
                   maxY >= lastCeil.y && maxY <(lastCeil.y + this.gameDetails.ceilHeight)){
                      boatInBoard = true;
                }
              }

              this.isPossibleInCeil = false;
              this.isPossibleBoat = false;

            if( this.myLastSel.id == boat.id ){
                console.log("if");

                if(!this._equalRowOrColumn(this.ceilsInBoat, boat.data.ceils)){
                  this.isPossibleInCeil = true;

                  console.log("if if", boat.data.ceils);
                  for(var j=0;j<boat.data.ceils.length;j++){
                    var ceil = this.board[boat.data.ceils[j]];
                    ceil.boat = false;
                    console.log("poniendo ceils a false ", ceil.boat);
                  }

                  console.log("ceils in boat ", this.ceilsInBoat);
                  for(var j=0;j<this.ceilsInBoat.length;j++){
                    var ceil = this.board[this.ceilsInBoat[j]];
                    if(ceil && ceil.boat == true){
                        this.isPossibleInCeil = false;
                    }
                  }
                }else{
                  console.log("if else");
                  //this.isPossibleInCeil = true;
                }
             }else{
               console.log("else");
                  this.isPossibleInCeil = true;
                 if(!this._equalRowOrColumn(this.ceilsInBoat, boat.data.ceils)){
                   console.log("else if");
                   for(var j=0;j<boat.data.ceils.length;j++){
                     var ceil = this.board[boat.data.ceils[j]];
                     ceil.boat = false;
                   }

                   for(var j=0;j<this.ceilsInBoat.length;j++){
                     var ceil = this.board[this.ceilsInBoat[j]];
                     if(ceil && ceil.boat == true){
                         this.isPossibleInCeil = false;
                     }
                   }
               }
             }



              console.log("is Possible In Ceil : ", this.isPossibleInCeil);



              if(boatInBoard && this.isPossibleInCeil){

                this.isPossibleBoat = true;
              }else{
                this.isPossibleBoat = false;
              }


       }
    }
  }


  Game.prototype._mouseUp= function(){


    if(this.mySel && !this.isPossibleBoat){
      console.log(this.canvasValid, this.mySel);
      this.mySel.x = this.mySel.startX;
      this.mySel.y = this.mySel.startY;
      this.invalidate();
      //this.draw();

    }else if(this.mySel && this.isPossibleInCeil){
      this.mySel.data.ceils = this.ceilsInBoat;
      this.myLastSel = this.mySel;
      for(var j=0;j<this.ceilsInBoat.length;j++){
        var ceil = this.board[this.ceilsInBoat[j]];
            ceil.boat = true;
      }
    }

    this.isDrag = false;
    this.canvas.onmousemove = null;
  }

  Game.prototype._equalRowOrColumn = function(val1, val2){
    var res = true;
    if(val1.length != val2.length){
      return false;
    }
    for(var i = 1; i<val1.length;i++){
      if(val1[i] != val2[i]){
        return false;
      }
    }
    return res;
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
