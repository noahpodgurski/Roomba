const FPS = 60;

let canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// get the context
var yCoordinate = 115;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var distance = 10;
var speed = 10;
var angle = 25;

function toRad(deg){
    return deg * Math.PI / 180
}

function drawRoomba(){
    Roomba.ctx.drawImage(roomba, Roomba.x, Roomba.y, 100, 100);
    // setCarControls();
}

function clearCanvas(){
    Roomba.ctx.clearRect(-100000000, -10000000000, canvasWidth*10000000, canvasHeight*100000000);
}

function moveRoombaForward(){
    let rad = toRad(90)
    let x = Math.cos(rad);
    let y = Math.sin(rad);
    // if (Roomba.direction > 0 && Roomba.direction < 180){
    //     y *= -1;
    // }
    // if (Roomba.direction > 90 && Roomba.direction < 270){
        //     x *= -1;
        // }
    
    Roomba.x += x*speed;
    Roomba.y -= y*speed;


    rad = toRad(Roomba.direction);
    x = Math.cos(rad);
    y = Math.sin(rad);
    Roomba.borderX += x*speed;
    Roomba.borderY -= y*speed;
}

function drawCircle() {
    Roomba.ctx.beginPath();
    Roomba.ctx.fillStyle = 'black';
    Roomba.ctx.arc(Roomba.x+51, Roomba.y+51, 50, 0, 2 * Math.PI);
    Roomba.ctx.fill();
}
function turnRoombaRight(x, y, w, h, degrees){
    // Roomba.ctx.save();
    Roomba.ctx.translate(x+w/2, y+h/2);
    Roomba.ctx.rotate(degrees*Math.PI/180.0);
    Roomba.direction -= degrees;
    Roomba.ctx.translate(-x-w/2, -y-h/2);
    // Roomba.ctx.restore();
}

function turnRoombaLeft(x, y, w, h, degrees){
    // Roomba.ctx.save();
    Roomba.ctx.translate(x+w/2, y+h/2);
    Roomba.ctx.rotate(-degrees*Math.PI/180.0);
    Roomba.direction += degrees;
    Roomba.ctx.translate(-x-w/2, -y-h/2);
    // Roomba.ctx.restore();
}

var roomba = new Image();
roomba.src = "./img/roomba.png";

let Roomba = {
    roomba: roomba,
    x: 600,
    y: 600,
    borderX: 600,
    borderY: 600,
    direction: 90,
    ctx: canvas.getContext('2d'),
    state: "forward",
    initTurn: 0
}

function isOutside(padding=200){
    // console.log(Roomba.y-padding)
    // console.log(Roomba.borderX-padding < 0, Roomba.borderX+padding > canvas.width, Roomba.borderY-padding < 0, Roomba.borderY+padding > canvas.height)
    // return Roomba.borderX-padding < 0 || Roomba.borderX+padding > canvas.width || Roomba.borderY+padding > canvas.height
    return Roomba.borderX-padding < 0 || Roomba.borderX+padding > canvas.width || Roomba.borderY-padding < 0 || Roomba.borderY+padding > canvas.height
}

function go(turning=0){ 
    clearCanvas();
    drawCircle();
    drawRoomba();   

    // let n = Math.random() * 100;
    
    switch (Roomba.state){
        case "forward": {
            moveRoombaForward();
            if (isOutside()){
                Roomba.initTurn = Roomba.direction;
                Roomba.state = "turning";
            }
            break;
        }
        case "turning": {
            turnRoombaLeft(Roomba.x, Roomba.y, 100, 100, 5)
            if (Math.abs(Roomba.direction - Roomba.initTurn) > 150)
                Roomba.state = "forward";
            break;
        }
    }

    // console.log(Roomba.borderX, Roomba.borderY)
    // console.log("Dir: " + Roomba.direction);
    // console.log(turning);
    // if (turning <= 0 && isOutside()){
    //     turnRoombaLeft(Roomba.x, Roomba.y, 100, 100, (Math.random()*90)+60)
    //     go(50)
    //     return;
    // }
    setTimeout(() => {
        go(turning-=1);
    }, 1000/FPS) // 60 FPS FRESH
}

go();