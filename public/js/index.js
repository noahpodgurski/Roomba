const FPS = 60;

let canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// get the context
var yCoordinate = 115;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var initSpeed = 5;
var speed = 0;
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
let visionNode = {
    x:0,
    y:0
}
let Roomba = {
    roomba: roomba,
    x: 600,
    y: 600,
    borderX: 600,
    borderY: 600,
    direction: 90,
    ctx: canvas.getContext('2d'),
    state: "turning on",
    previousState: "forward",
    initTurn: 0,
    on:true
}

function isOutside(padding=200){
    // console.log(Roomba.y-padding)
    // console.log(Roomba.borderX-padding < 0, Roomba.borderX+padding > canvas.width, Roomba.borderY-padding < 0, Roomba.borderY+padding > canvas.height)
    // return Roomba.borderX-padding < 0 || Roomba.borderX+padding > canvas.width || Roomba.borderY+padding > canvas.height
    return Roomba.borderX-padding < 0 || Roomba.borderX+padding > canvas.width || Roomba.borderY-padding < 0 || Roomba.borderY+padding > canvas.height
}

//RETURN FALSE IF NOTHING AHEAD, RETURN TRUE OF THERE IS
function lookAhead(padding = 200){
    jump = 5;
    visionNode.x = Roomba.borderX;
    visionNode.y = Roomba.borderY;
    for (let i = 0; i < 1000; i+=5){
        visionNode.x += jump*Math.cos(toRad(Roomba.direction))
        visionNode.y -= jump*Math.sin(toRad(Roomba.direction))
        //console.log(visionNode.x +" "+ visionNode.y);
        //HIT DETECTION FOR OTHER STUFF GOES HERE
        if (visionNode.x < 0 || visionNode.x > canvas.width-150 || visionNode.y < 0 || visionNode.y > canvas.height-150){
            console.log(jump*i);
            if( jump*i >padding){
                return false;
            }
            else{
                return true;
            }
        }

    }

    return true;
}

function getMousePos(canvas, event){
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    if(mousePos.x < Roomba.borderX+60 && mousePos.x > Roomba.borderX+40 && mousePos.y < Roomba.borderY+60 && mousePos.y > Roomba.borderY+40){
        if (Roomba.on){ 
            Roomba.on = false;
            Roomba.state = "turning on";
        }
        else{
            Roomba.on = true;
        }
        alert("hit");
    }
}, false);

function go(turning=0){ 
    clearCanvas();
    drawCircle();
    drawRoomba();   

    // let n = Math.random() * 100;
    if (Roomba.on){
        if (speed < initSpeed) {
            speed += 0.1;
        }
    }
    else{
        if (speed > 0) {
            speed -= 0.1;
        }
        else{
            speed = 0;
        }
    }

        switch (Roomba.state){
            case "forward": {
                if (lookAhead()){
                    Roomba.initTurn = Roomba.direction;
                    Roomba.state = "turning";
                }else{
                moveRoombaForward();
                }
                break;
            }
            case "turning": {
                turnRoombaLeft(Roomba.x, Roomba.y, 100, 100, speed)
                if (Math.abs(Roomba.direction - Roomba.initTurn) > 150)
                    Roomba.state = "forward";
                break;
            }
            case "turning off":{

            }
            case "turning on":{
                Roomba.state = "forward";
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