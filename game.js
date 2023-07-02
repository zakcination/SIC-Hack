
/**
 * @type { HTMLCanvasElement }
 */
var scene = document.getElementById("scene");
var ctx = scene.getContext("2d");
var markerObj = new Image();
var fire=new Image();
var lily=new Image();
var final=new Image();
var level=0;

function pocketl(response){
    const obj=JSON.parse(response);
    alert(obj[0])
}

let grid=[
    [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,2,0,0,0,0],
        [0,0,1,0,0,0,0],
        [0,0,1,0,0,0,0],
        [0,0,1,0,0,0,0],
        [0,0,3,0,0,0,0]
        ],[
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,2,1,0,0,0],
    [0,0,0,1,1,0,0],
    [0,0,0,0,1,1,0],
    [0,0,0,0,0,1,1],
    [0,0,0,0,0,0,3]
],
    [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,2,1,1,0,0],
    [0,0,0,0,1,1,1],
    [0,0,0,0,0,0,3],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
        ]];

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if(grid[level][i][j]==2){
                    var playerX=j;
                    var playerXstart=playerX;
                    var playerY=i;
                    var playerYstart=playerY;
                }
              } 
          }


scene.width = 400;
scene.height = 400;





function drawGrid(startX, startY, endX, endY, gridCellSize) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    for (x = startX; x <= endX; x += gridCellSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }

    for (y = startY; y <= endY; y += gridCellSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }

  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.closePath();
}
function createPlayer(gridCellSize){
    ctx.drawImage(markerObj,playerX*gridCellSize,playerY*gridCellSize);
  
}
function gameOver(){
    alert("gameOver");
    playerX=playerXstart;
    playerY=playerYstart;
}
function gameFinish(){
    alert("congrats");
    
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if(grid[level][i][j]==2){
                playerX=j;
                playerXstart=playerX;
                playerY=i;
                playerYstart=playerY;
            }
          } 
      }

      createPlayer(25);
}
function moveRight(){
    playerX=playerX+1;
    if(grid[level][playerY][playerX]==0){
        gameOver();
    }
    if(grid[level][playerY][playerX]==3){
        level=level+1;
        if (level!=3)
        gameFinish();
        else{
        alert("you won");
        window.location.href = "http://127.0.0.1:5000/";
        }
    }
}
function moveLeft(){
    playerX=playerX-1;
    if(grid[level][playerY][playerX]==0){
        gameOver();
    }
    if(grid[level][playerY][playerX]==3){
        level=level+1;
        if (level!=3)
        gameFinish();
        else{
        alert("you won");
        window.location.href = "http://127.0.0.1:5000/";
        }
    }
}
function moveUp(){
    playerY=playerY-1
    if(grid[level][playerY][playerX]==0){
        gameOver();
    }
    if(grid[level][playerY][playerX]==3){
        level=level+1;
        if (level!=3)
        gameFinish();
        else{
        alert("you won");
        window.location.href = "http://127.0.0.1:5000/";
        }

    }

}
function moveDown(){
    playerY=playerY+1;
    if(grid[level][playerY][playerX]==0){
        gameOver();
    }
    if(grid[level][playerY][playerX]==3){
        level=level+1;
        if (level!=3)
        gameFinish();
        else{
        alert("you won");
        window.location.href = "http://127.0.0.1:5000/";
        }
    }
}

document.body.addEventListener('keydown',changeDirection);

function changeDirection() {
    const LEFT_KEY = 65;
    const RIGHT_KEY = 68;
    const UP_KEY = 87;
    const DOWN_KEY = 83;

    const keyPressed = event.keyCode;


    if (keyPressed === LEFT_KEY) {
        moveLeft();
    }
    if (keyPressed === UP_KEY) {
        moveUp();
    }
    if (keyPressed === RIGHT_KEY) {
        moveRight();
    }
    if (keyPressed === DOWN_KEY) {
        moveDown();
    }
}

function fillGrid(){
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if(grid[level][i][j]==0)
                ctx.drawImage(fire,j*25,i*25);
            if(grid[level][i][j]==1)
                ctx.drawImage(lily,j*25,i*25);
            if(grid[level][i][j]==2){
                ctx.drawImage(lily,j*25,i*25);
                var playerX=j;
                var playerXstart=playerX;
                var playerY=i;
                var playerYstart=playerY;
            }
            if(grid[level][i][j]==3)
                ctx.drawImage(final,j*25,i*25);
          } 
      } 
}


function main() {
  ctx.clearRect(0, 0, scene.width, scene.height);
  fillGrid();
  drawGrid(0, 0, scene.width, scene.height, 25);
  createPlayer(25)
  requestAnimationFrame(main);
}

window.onload = function() {
  main();
}
markerObj.src = 'static/frog.png';
fire.src = 'static/fire.png';
lily.src='static/lily.png';
final.src='static/final.png';
main();