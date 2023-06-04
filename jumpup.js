//board
let board;
let boardWidth = 360;
let boardHeight = 545;
let context;

//jumper
let jumperWidth = 46;
let jumperHeight = 40;
let jumperX = boardWidth/2 - jumperWidth/2;
let jumperY = boardHeight*7/8 - jumperHeight;

let jumper = {
    img : null,
    x : jumperX,
    y : jumperY,
    width : jumperWidth,
    height : jumperHeight, 
}

//physics
let velocityX = 0;
let velocityY = 0; // jumper jump speed
let initialvelocityY = -8; //starting velocityY
let gravity = 0.5;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 20;
let platformImg;

//score
let score = 0;
let maxScore = 0;

let gameOver = false;



window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    /*context.fillstyle = "green";
    context.fillRect(jumper.x, jumper.y,jumper.width, jumper.height);*/
    //images
    jumperImg = new Image ();
    jumperImg.src = "./Jumper-transp.png";
    jumper.img = jumperImg;
    jumperImg.onload = function () {
        context.drawImage(jumper.img, jumper.x, jumper.y,jumper.width, jumper.height);
    }
    platformImg = new Image ();
    platformImg.src = "./platform_1.png";

    velocityY = initialvelocityY;

    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener ("keydown", moveJumper);
    }
    function update() {
    requestAnimationFrame (update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    //jumper
    jumper.x += velocityX;
    if (jumper.x > boardWidth) {
        jumper.x = 0;
    }
    else if (jumper.x + jumper.width < 0) {
        jumper.x = boardWidth;
    }
    velocityY += gravity;
    jumper.y += velocityY;
    if (jumper.y > board.height) {
        gameOver = true;
    }
    context.drawImage(jumper.img, jumper.x, jumper.y,jumper.width, jumper.height);
    //platform
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray [i];
        if (velocityY < 0 && jumper.y < boardHeight*3/4) {
            platform.y -= initialvelocityY; //platform slide down

        }
        if (detectCollision (jumper, platform) && velocityY >= 0) {
          velocityY = initialvelocityY; // jump up   
        }
        context.drawImage (platform.img, platform.x, platform.y, platform.width, platform.height);
    }
    // clear and add new
    while (platformArray.length > 0 && platformArray [0].y >= boardHeight) {
        platformArray.shift();
        newPlatform();
    }
    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px Arial";
    context.fillText (score, 5, 20);
    if (gameOver) {
        context.fillText ("Game Over: Press Space to Restart", boardWidth/7, boardHeight*7/8);
    }
}
function moveJumper (event) {
    if (event.code == "ArrowRight" || event.code == "KeyD"){ //move right
    velocityX = 4;
    jumper.img = jumperImg;
    }
    else if (event.code == "ArrowLeft" || event.code == "KeyA") { //move left
    velocityX = -4;
    jumper.img = jumperImg; 
    }
    else if (event.code == "Space" && gameOver) {
        //reset
        jumper = {
            img : jumperImg,
            x : jumperX,
            y : jumperY,
            width : jumperWidth,
            height : jumperHeight,  
    }
    velocityX = 0;
    velocityY = initialvelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
    }
}
function  placePlatforms () {
    platformArray = [];
    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width: platformWidth,
        height: platformHeight,
    }
    platformArray.push(platform);

    //    platform = {
    //         img : platformImg,
    //         x : boardWidth/2,
    //         y : boardHeight - 150,
    //         width: platformWidth,
    //         height: platformHeight,
    //     }
   // platformArray.push(platform);

   for (let i = 0; i < 7; i++) {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformImg,
        x : randomX,
        y : boardHeight - 65 * i - 130,
        width: platformWidth,
        height: platformHeight,
    }
    platformArray.push(platform);
   }
}
function newPlatform () {
    let randomX = Math.floor(Math.random() * boardWidth*74/100); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width: platformWidth,
        height: platformHeight,
    }

    platformArray.push(platform);
}
function detectCollision (a, b) {
    return a.x < b.x + b.width && //a`s top left corner does not reach b`s top right corner
            a.x + a.width > b.x && //a` top right corner passes b`s top left corner
            a.y < b.y + b.height && // a`s top left corner does not reach b`s bottom left corner
            a.y + a.height > b.y; // a`s bottom left corner passes b`s top left corner
}
function updateScore() {
    let points = Math.floor(10*Math.random());
    if (velocityY < 0) {
     maxScore += points;
     if (score < maxScore)  {
        score = maxScore;
     } 
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}