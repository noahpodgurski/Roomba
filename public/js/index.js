const FPS = 60;

let vacuumStart = document.getElementById('vacuumStart');
let vacuumSuck = document.getElementById('vacuumSuck');
let vacuumStop = document.getElementById('vacuumStop');
vacuumStart.volume = .3;
vacuumSuck.volume = .3;
vacuumStop.volume = .3;
//vacuumSuck.loop = true;
vacuumSuck.autoplay = true;
vacuumSuck.preload = true;

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

let basketBall = document.getElementById('basketBall');

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  //if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    //document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  //} else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  //}

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function toRad(deg){
    return deg * Math.PI / 180
}

function drawRoomba(){
    Roomba.ctx.drawImage(roomba, Roomba.x, Roomba.y, 100, 100);
}

function clearCanvas(){
    Roomba.ctx.clearRect(-100000000, -10000000000, canvasWidth*10000000, canvasHeight*100000000);
}

function moveRoombaForward(){
    let rad = toRad(90)
    let x = Math.cos(rad);
    let y = Math.sin(rad);

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
    //moves the roomba with the rotation so that it stays centered
    Roomba.ctx.translate(x+w/2, y+h/2);
    Roomba.ctx.rotate(degrees*Math.PI/180.0);
    Roomba.direction -= degrees;
    Roomba.ctx.translate(-x-w/2, -y-h/2);
}

function turnRoombaLeft(x, y, w, h, degrees){
    //moves the roomba with the rotation so that it stays centered
    Roomba.ctx.translate(x+w/2, y+h/2);
    Roomba.ctx.rotate(-degrees*Math.PI/180.0);
    Roomba.direction += degrees;
    Roomba.ctx.translate(-x-w/2, -y-h/2);
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
    state: "turning off",
    previousState: "forward",
    initTurn: 0,
    on:false
}

function isOutside(padding=200){
    // console.log(Roomba.y-padding)
    // console.log(Roomba.borderX-padding < 0, Roomba.borderX+padding > canvas.width, Roomba.borderY-padding < 0, Roomba.borderY+padding > canvas.height)
    // return Roomba.borderX-padding < 0 || Roomba.borderX+padding > canvas.width || Roomba.borderY+padding > canvas.height
    return Roomba.borderX-padding < 0 || Roomba.borderX+padding > canvas.width || Roomba.borderY-padding < 0 || Roomba.borderY+padding > canvas.height
}

//RETURN FALSE IF NOTHING AHEAD, RETURN TRUE OF THERE IS
function lookAhead(padding = 200){
    //this uses the vision node to step ahead 5 pixels to see if there is anything ahead.
    //once it hits something, it sees how close it is by pixel count.
    basketBall.x = basketBall.getBoundingClientRect().x;
    basketBall.y = basketBall.getBoundingClientRect().y;
    console.log(basketBall.getBoundingClientRect());
    jump = 5;
    visionNode.x = Roomba.borderX;
    visionNode.y = Roomba.borderY;
    for (let i = 0; i < 1000; i+=5){
        visionNode.x += jump*Math.cos(toRad(Roomba.direction))
        visionNode.y -= jump*Math.sin(toRad(Roomba.direction))
        //HIT DETECTION FOR OTHER STUFF GOES HERE
        if (visionNode.x > basketBall.x-50 && visionNode.x < basketBall.x+100 && visionNode.y > basketBall.y-50 && visionNode.y < basketBall.y+100){
            //jump*i is the distance from the roomba to where it collided with something
            console.log(jump*i)
            if( jump*i >padding){
                return false;
            }
            else{
                return true;
            }
        }
        if (visionNode.x < 0 || visionNode.x > canvas.width-150 || visionNode.y < 0 || visionNode.y > canvas.height-150){
            //jump*i is the distance from the roomba to where it collided with something
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

function loopAudio() {
    console.log('restart')
    // vacuumSuck.fastSeek(0);
    vacuumSuck.currentTime = 0;
    if (Roomba.on){
        setTimeout(() => {
        loopAudio();
    }, 5000)
}
}

//Roomba on off function
canvas.addEventListener('click', function(evt) {
    
    var mousePos = getMousePos(canvas, evt);
    if(mousePos.x < Roomba.borderX+60 && mousePos.x > Roomba.borderX+40 && mousePos.y < Roomba.borderY+60 && mousePos.y > Roomba.borderY+40){
        if (Roomba.on){ //TURN OFF
            Roomba.on = false;
            vacuumSuck.pause();
            vacuumStop.play();
        }
        else{ //TURN ON
            vacuumStart.play();
            setTimeout(() => {
                vacuumSuck.play();
                loopAudio();
            }, 2000)
            Roomba.on = true;
            Roomba.state = "turning on";
        }
    }
}, false);

//main loop
function go(turning=0){ 
    //dragElement(document.getElementById("mydiv"));
    dragElement(basketBall);

    clearCanvas();
    drawCircle();
    drawRoomba();  

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
            Roomba.state = "off"
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
                
                break;
            }
            case "turning on":{
                Roomba.state = "forward";
                break;
            }
            case "off": {
                break;
            }
        }
    
    setTimeout(() => {
        go(turning-=1);
    }, 1000/FPS) // 60 FPS FRESH
}

go();