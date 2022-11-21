const canvas = document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const stateDuration = 1000;
const LANE_WIDTH = canvas.width/3;
const LANE_COUNT = 3;
const SCORE_SPEED = 1;
const PlayerState = {
    Flying: "Flying", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping: "Jumping",
    Ducking: "Ducking"
};
let lastTime = Date.now();
let lastClick = Date.now();
let lastRectSpawn = Date.now();
let lastCoinSpawn = Date.now();
let clickDelay = 300; //This is milliseconds
let spawnDelay = 1500; //This is also in milliseconds
let spawnCoinDelay = 2000
let objectLane = 0;
let objectColor = ["yellow","brown","black"]
let objectType = ["Ducking", "Jumping","Powerup"]
let SCORE = 0;
let HIGH_SCORE = 0;


const allPressedKeys = {};
window.addEventListener("keydown", function (event) {
    allPressedKeys[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
    allPressedKeys[event.keyCode] = false;
});

const rects = [
    lane1 = {
        x: 0,
        y: 500,
        width: LANE_WIDTH,
        height: 50,
        color: "red",
    },
    lane2 = {
        x: canvas.width / 3,
        y: 500,
        width: LANE_WIDTH,
        height: 50,
        color: "green",
    },
    lane3 = {
        x: canvas.width / 3 * 2,
        y: 500,
        width: LANE_WIDTH,
        height: 50,
        color: "purple",
    }
]
const coin = [

]
const player = {
    x: canvas.width / 2 - 25,
    y: 600,
    width: 50,
    height: 50,
    color: "blue",
    lane: 2,
    state: PlayerState.Running
};
const KEYS = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    Space: 32,
    ArrowLeft: 37,
    ArrowRight: 39,
    ArrowUp: 38,
    ArrowDown: 40,
};
requestAnimationFrame(runFrame);

function runFrame() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    // process input
    processInput();
    // update state
    console.log(deltaTime);
    update(deltaTime);
    // draw the world
    draw();
    // be called one more time
    requestAnimationFrame(runFrame);
}

function updateAllEntities(array, startingPosition, deltaTime) {
    for (let i = startingPosition; i < array.length; i++){
        array[i].y += array[i].speed * deltaTime/1000;
        if (array[i].y >= canvas.height){
            array.splice(i,1);
        }        
    }
}
function update(deltaTime){
    SCORE += SCORE_SPEED
    if (lastRectSpawn <= Date.now() - spawnDelay){
        generateObject();
        lastRectSpawn = Date.now();
    }
    if (lastCoinSpawn <= Date.now() - spawnCoinDelay){
        generateCoin()
        lastCoinSpawn = Date.now()
        console.log("coin")
    }
    updateAllEntities(rects, 3, deltaTime);
    updateAllEntities(coin, 0, deltaTime);
}
function processInput(){
    if (allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft]) {
        if (lastClick <= Date.now() - clickDelay && player.lane - 1 >= 1){
            player.lane -= 1;
            lastClick = Date.now();
            player.state = PlayerState.Running;
        }
    }
    if (allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]) {
        if (lastClick <= Date.now() - clickDelay && player.lane + 1 <= 3){
            player.lane += 1;
            lastClick = Date.now();
            player.state = PlayerState.Running;
        }
    }
    if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown]) {
        if (player.state == PlayerState.Running){
            player.state = PlayerState.Ducking;
            console.log(player.state);
            setTimeout(runState, stateDuration);
        }
    }
    if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp]) {
        if (player.state == PlayerState.Running){
            player.state = PlayerState.Jumping;
            console.log(player.state);
            setTimeout(runState, stateDuration);
        }
    }
    player.x = player.lane * LANE_WIDTH - LANE_WIDTH/2 - player.width / 2;
}

function draw() {
    // 2d context can do primitive graphic object manipulation
    // it can draw points, lines, and anything composed of those
    // it has predefined commands for basic objects like players, coin and images
    // when drawing, we can decide whether we want to stroke or fill the path

    // before we start drawing, clear the canvas

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "gray";
    context.fillRect(500, 0, 100, 100);
    context.fillStyle = "purple";
    console.log("Canvas height: ", canvas.height);
    context.fillRect(500, canvas.height - 200, 100, 100);


    for (let i = 0; i < rects.length; i++) {
        context.fillStyle = rects[i].color;
       context.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
    }
    if (coin != []){
        for (let i = 0; i < coin.length; i++){
            context.beginPath();
            context.arc(coin[i].x, coin[i].y, coin[i].radius,0, 2*Math.PI, false);
            context.closePath()
            context.fillStyle = coin[i].color;
            context.fill();
        }
    }
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "black"
    context.font = "20px Arial";
    context.fillText("SCORE: " + SCORE, 50, 100);
    context.font = "20px Arial";
    context.fillText("HIGH SCORE: " + HIGH_SCORE, 50, 50);

}

function generateObject(){
    //while(objectLane == 0){
    //objectLane = Math.round(Math.random() * 3);
    //}
    objectLane = Math.floor(Math.random() * LANE_COUNT) + 1;
    type = Math.floor(Math.random()*3);
    //console.log(objectLane)
    rects.push(
        object = {
            x: LANE_CALCULATION(objectLane,50),//I don't know how to find the objects width when the width has not been defined yet
            y: -50,
            width: 50,
            height: 50,
            color: objectColor[type],
            speed: 150,
            requiredState: objectType[type]
        }
    )
    //console.log(rects)
}
function generateCoin(){
    objectLane = Math.floor(Math.random() * LANE_COUNT) + 1;
    coin.push(
        object = {
            x: LANE_CALCULATION(objectLane,0),
            y: 0,
            radius: 25,
            color: "yellow",
            speed: 150
        }
    )
}
function isColliding(obstacle, player){
    return (
        obstacle.x <= player.x + player.width &&
        obstacle.x + obstacle.width >= player.x &&
        obstacle.y + obstacle.height >= player.y &&
        obstacle.y <= player.y + player.height
    )
}
function isDodging(obstacle,player){
    return obstacle.requiredState == player.state;
}
function runState(){
    player.state = PlayerState.Running
    console.log(player.state)
}
function LANE_CALCULATION(lane,Width){
    return lane * LANE_WIDTH - LANE_WIDTH/2 - Width/2;
}
