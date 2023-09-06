//board
let board;
let boardWidth=500;
let boardHeight=500;
let context;
  //player
  let playerWidth=100;
  let playerHeight=10; 
  let playerVelocityX=20;

  let player ={
  	x:boardWidth/2-playerWidth/2,
  	y:boardHeight-playerHeight-5,
  	width:playerWidth,
  	height:playerHeight,
    velocityX :playerVelocityX
  }
   //For ball
  
   let ballWidth=10;
   let ballHeight=10;
   let ballVelocityX=3;
   let ballVelocityY=2;
  
  let ball={
    x :boardWidth/2,
    y :boardHeight/2,
    width:ballWidth,
    height:ballHeight,
    velocityX:ballVelocityX,
    velocityY:ballVelocityY
  }
   //blocks
  let blockArray=[];
  let blockWidth= 50;
  let blockHeight=10;
  let blockColumns=8;
  let blockRows=3;//add more as game goes
  let blockMaxRows=10;//limit for the rows
  let blockCount=0;

  //starting block corner top left
   let blockX=15;
   let blockY=45;

   let score=0;
   let gameOver=false;
   window.onload =function(){
  	board=document.getElementById("board");
  	board.height= boardHeight;
  	board.width=boardWidth; 
    context=board.getContext("2d");// used for  drawing on the board
    
    //draw a player
     context.fillStyle="skyblue";
     context.fillRect(player.x,player.y,player.width,player.height);
    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    // create blocks
    creatBlocks();
  }
   function update(){
    requestAnimationFrame(update);
    if(gameOver){
      return;
    }
    context.clearRect(0,0,board.width,board.height);// this is to clear the static position
    //player
     context.fillStyle="#fcf37e";
     context.fillRect(player.x,player.y,player.width,player.height);

     context.fillStyle="#e0902e";
     ball.x+=ball.velocityX;
     ball.y+=ball.velocityY;
     context.fillRect(ball.x,ball.y,ball.width,ball.height);
     // bounce of ball b/w walls
     if(ball.y <=0){
      // if ball touches the top of canvas
      ball.velocityY *=-1;// for reverse direction
     }
     else if(ball.x <=0 || (ball.x +ball.width) >= boardWidth){
      //if the ball touches left or right of canvas
      ball.velocityX *=-1;// this is for reverse direction
     }
     else if(ball.y +ball.height >= boardHeight){
      // if ball touches bottom the game over
       context.fillStyle="#e0902e"
       context.font="20px san-serif";
       context.fillText("Game over.",200,400);
       gameOver=true;
     }
      //bounce the ball off player paddle
     if(topCollision(ball,player) || bottomCollision(ball,player)){
        ball.velocityY *=-1;//to flip y direction up or down
     }
      else if(leftCollision(ball, player) || rightCollision(ball,player)){
        ball.velocityX *=-1;// to flip x direction up or down
      }
      //blocks
      context.fillStyle="skyblue";
      for(let i=0;i<blockArray.length;i++){
        let block=blockArray[i];
        if(!block.break){
          if(topCollision(ball,block)|| bottomCollision(ball,block)){
            block.break=true;
            ball.velocityY*=-1;// flip y direction
            blockCount -=1;
            score +=100;
          }
          else if(leftCollision(ball,block)||rightCollision(ball,block)){
            block.break=true;
            ball.velocityX *=-1;// to flip x direction
            blockCount-=1;
            score +=100;
          }
          context.fillRect(block.x,block.y,block.width,block.height);
        }
      }
      //score
      context.font="20px san-serif";
      context.fillText(score,10,25);
   }
     function outOfBounds(xposition) {
       return (xposition < 0 || xposition + playerWidth > boardWidth)
     }
    function movePlayer(e) {
      
      if(e.code == "ArrowLeft")
      {
        //player.x -=player.velocityX;
         let nextPlayerX=player.x - player.velocityX;
         if(!outOfBounds(nextPlayerX)){
          player.x =nextPlayerX;
         }
      }
     else if(e.code == "ArrowRight")
     {
     // player.x += player.velocityX;
        let nextPlayerX=player.x + player.velocityX;
        if(!outOfBounds(nextPlayerX)){
          player.x = nextPlayerX;
        }
      }
    } 
    function detect(a,b) {
      return a.x < b.x + b.width && // a's top left corner dont reach b's top right corner
      a.x + a.width > b.x && //a's top right corner passes b's top left corner
      a.y < b.y +b.height && //a's top left corner dontt reach b's bottom left corner
      a.y + a.height > b.y; // a's bottom left corner passes b's top left corner    

    }

     function topCollision(ball,block) { //a is above b(ball is above block)
      return detect(ball, block) && (ball.y + ball.height) >= block.y;
     }
     function bottomCollision(ball,block){
      return detect(ball,  block) && (block.y + block.height) >= ball.y;
    }
    function leftCollision(ball,block) {//a is left of b (ball is left of block)
          return detect(ball,block) && (ball.x + ball.width) >= block.x;
    }
    function rightCollision(ball,block){
      return detect(ball,block) && (block.x + block.width) >=ball.x; 
    }
     function creatBlocks() {
       blockArray=[]; // to clear blocks
       for(let c=0;c<blockColumns;c++){
        for(let r=0;r<blockRows;r++){
          let block ={
            x:blockX + c*blockWidth + c*10,//space 10 px for column 
            y:blockY + r*blockHeight + r*10,//space 10 px for row
            width :blockWidth,
            height :blockHeight,
            break : false
           }
           blockArray.push(block);
        } 
       }
       blockCount=blockArray.length;
     }

      
