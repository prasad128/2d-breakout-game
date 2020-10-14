let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext("2d");
/*let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;*/

/*ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "blue";
ctx.fill();
ctx.closePath();*/

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
let ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var lives = 3;
var score = 0;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//var ballColor = 0

//drawStrokeRect();
function drawBall(){
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }

}
    
      



function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    collisionDetection();
    drawPaddle();
    drawScore();
    drawLives();
    drawStart();

    x += dx;
    y += dy;
    if(x + dx > canvas.width - ballRadius || x + dx < 0 + ballRadius) {
        dx = -dx;
    }
    
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy + ballRadius > canvas.height) {
        
        
        lives--;
        if(!lives) {
            alert("GAME OVER\n Your total score is "+score);
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
        else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width-paddleWidth)/2;
        }
        
    }
    else if(y + dy + ballRadius > canvas.height - paddleHeight){
        if(x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth) {
            dy = -dy;
            //setInterval(draw, 100);
        }

    }
        
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    //requestAnimationFrame(draw);
}


function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status === 1){
                if(x + ballRadius >= b.x && x - ballRadius <= b.x+brickWidth && y + ballRadius >= b.y && y - ballRadius <= b.y+brickHeight) {
                    dy = -dy;
                    //ballColor = 1;
                    b.status = 0;
                    score += 100;
                    if(score == (brickRowCount*brickColumnCount) * 100) {
                        //bgC = 1;
                        //drawBricks();
                        alert("YOU WIN, CONGRATULATIONS!\n Your total score is "+score);
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            
            }
        }
    }
}

//ballColor = 0;

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}


function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//let interval;
function start(){
    startStatus = 1;
    interval = setInterval(draw, 10);
    
}

//draw();
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
let startStatus = 0
function drawStart() {
    if(startStatus === 0){
        ctx.font = "40px Arial";
    //ctx.backgroundStyle = "rgb(150,150,0)";
    ctx.fillStyle = "#009522";
    ctx.fillText("Start", canvas.width/2 - 50, canvas.height/2 + 30);
    }
}
drawStart();
drawBricks();
drawBall();
drawPaddle();
drawScore();
drawLives();
document.addEventListener('click', start, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener('keydown', start, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX  = relativeX - paddleWidth/2;
        //paddleX += paddleWidth/2;
    }
}