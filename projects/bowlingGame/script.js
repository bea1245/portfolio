// steps.
// drag the ball
// make the ball move  
// knock the pins down
// move ball back into the original positon
// keep track of scoring
// switch between players

// use local storage and have the players enter their names. 
// have it be able to have one player up to 4 players

// save score of each game in local storage
// hall of fame score with top scores of all time

let startGamePopup = document.querySelector(".start-game-popup");
let startGameBtn = document.getElementById("startGameBtn");
let choosePlayersSelect = document.getElementById("choose-players");
let selectedPlayersText = document.getElementById("selectedPlayerText");
let errorMessage = document.getElementById("errorMessage");
let startGameTextarea = document.getElementById("start-game-textarea");

let playerName = document.querySelectorAll(".player-name");
let playerScore = document.querySelectorAll(".player-score");

let restartGameBtn = document.getElementById("restart-btn");
let winnerDisplay  = document.getElementById("winner-display");
let hallOfFameDiv = document.getElementById("hallOfFame");
// keep track of who wins
let ball = {
  radius: 20,
};
let alleyObj = {};
let pinObj = {};



// create object for pins and alley
const gutterLeftElem = document.querySelector("#gutter-left");
const gutterRightElem = document.querySelector("#gutter-right");
let gutterWidth = ball.radius * 2 + 10; // +10px wider than the ball
gutterLeftElem.style.width = `${gutterWidth}px`;
gutterRightElem.style.width = `${gutterWidth}px`;

const ballElem = document.querySelector("#ball");
ballElem.style.width = `${ball.radius * 2}px`;
ballElem.style.height = `${ball.radius * 2}px`;

const alley = document.querySelector("#alley");
// const alleyRect = alley.getBoundingClientRect();

const pins = document.querySelectorAll(".pin");
const toggleGuttersBtn = document.getElementById("toggleGutters");
let currentPlayerElem = document.querySelector("#current-player");
let playerScoreElem = document.querySelectorAll(".player-score");

let grandTotalDiv = document.getElementById("grand-total-div");
let currentPlayerName = document.getElementById("current-player-name");

let playerOneScore = document.getElementById("player1-score");
let playerTwoScore = document.getElementById("player2-score");
let playerThreeScore = document.getElementById("player3-score");
let winnerName = document.getElementById("winner-name");
let gameOverOverlay = document.getElementById("gameOverOverlay");
let winnerText = document.getElementById("winnerText");
let restartBtn = document.getElementById("restartBtn");
let scoreboard = document.querySelector(".scoreboard");

let player = document.querySelectorAll(".player");
let gameUI = document.getElementById("gameUI");
let rows = document.querySelectorAll(".row");

let winnerScore = document.getElementById("winnerScore");
let winnerEmoji = document.getElementById("winnerEmoji");


// text on the buttons needs more contrast
// try playing a game and see if there is anything else

let startX;
let startY;
let startBallX;
let startBallY;
let ballX;
let ballY;
let deltaX;
let deltaY;
let isDragging = false;
let xSpeed = 5;
let ySpeed = -5;
// how many times per second your code updates and redraws on the screen
let framesPerSecond = 60;
let newX;
let newY;
let intendedX;
let intendedY;
let minX;
let minY;
let pointerOffsetX;
let pointerOffsetY;
let reqBall;
let totalRolls = 0;
let ballInGutter = false;
let useBumpers = false;
let currentPlayerIndex = 0;
// let players = ["Mary", "Bea", "John"];
// let playerScores = [
//   [0,0,0],
//   [0,0,0]
// ];
// let playerRolls = [
//   [],
//   [],
//   []
// ];
let totalRoundsInGame = 10;
let rollCounted = false;
let countRolls = 0;
let maxRolls = 2;
let rollInFrame = 1;// 1 or 2
let pinsRemaining = 10;
let currentRound = 1;
// let playerFrames = [
//   [],// player 1 frames
//   [], // player 2 frames
//   [], //player 3 frames
// ];
let isStrike = false;
let isSpare = false;
let firstRoll = true;
let secondRoll = null;
let currentFrameIndex = 0;
let isRolling = false;
// rollProcessed means - i have already handled the scoring for THIS roll - dont run again
let rollProcessed = false;
let totalScore = 0;
// let grandTotal = 0;
// let playerTotals = [];
let gameOver = false;
let frameEnded = false;
let currentHighestScore = -Infinity;
let currentWinnerIndex = 0;
let currentFrameScore = 0;
let countPinsThatFell = 0;
let pinsSettled = true;
let stopBall = true; 
let countPinsFallen = 0;

let maxX;
let maxY;
let ballState = "idle";
let stopLock = false;

let finalScoreArr = [];

let currentFrame = {
  roll1: null,
  roll2: null,
  spare: false,
  strike: false
};

let playerDataArr = [];
let hallOfFame = [];

window.addEventListener("load", () => {
  loadHallOfFame();
  renderHallOfFame();
});
 
window.addEventListener("resize", () => {
  calculateBounds();
});

restartGameBtn.addEventListener("click", () => {
  localStorage.removeItem("playerDataArr");
  window.location.reload();
});

function startGameUI(){
  renderPlayerNames();
  // updateCurrentPlayer();
  startGamePopup.classList.add('hidden');
  // what line of code would remove
  // the hidden class from gameUI
  gameUI.classList.remove("hidden");
  // if gameUi is showing, i want to call resetBllPostion
  resetBallPosition();
  hallOfFame.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function(){
  initGame();
  loadFromLocalStorage();
  console.log(playerDataArr);
  // if players exist, renderlayerNames, udateCurrentLayer, hide 
  if(playerDataArr.length > 0){
    startGameUI();
  }
  else {
    startGameBtn.addEventListener("click", (e) => {
      // errorMessage.innerHTML = "";
      e.preventDefault();
      // select value(number of payers)
      // textarea value(names string)
      let getSelectValue = choosePlayersSelect.value;
      let getTextareaValue = startGameTextarea.value;
      // if get select value is not selected throw an error
      if(!getSelectValue){
        errorMessage.innerHTML = "You must select how many players you want";
        return;
      }
      if(!getTextareaValue.trim()){
        errorMessage.innerHTML = "Please enter player names";
        return;
      }
      let cleanTextarea = getTextareaValue.split(",").map(currVal => currVal.trim()).filter(item => item !== "");
      // do counts match?
      // are names unique 
      let playerCount = Number(getSelectValue);
  
      
      if(playerCount !== cleanTextarea.length){
        errorMessage.innerHTML = "The selected players must match how many players are selected";
        return;
      }
      let isUnique = new Set(cleanTextarea).size === cleanTextarea.length;
      if(!isUnique){
        errorMessage.innerHTML = "Player names must be unique";
        return;
      }
  
      // ok next outptut
      // before the loop,reset varaibles
      resetGameState();
      playerDataArr = [];
      localStorage.removeItem('playerDataArr');
     for(let i = 0; i < cleanTextarea.length; i++){ 
      let currentPlayer = cleanTextarea[i];
      let playerDataObj = {
        name: currentPlayer,
        score: 0,
        frames : [],
        rolls: []
      }
      playerDataArr.push(playerDataObj);    
     }

       
     savePlayersToLocalStorage();
     startGameUI();
    });
  
  }
  
});

// function updateCurrentPlayer(){
//   let player = playerDataArr[currentPlayerIndex];
//   // selectedPlayersText.innerHTML = `${player.name}'s turn`;
//   currentPlayerElem.innerHTML = `${playerDataArr[currentPlayerIndex].name}'s turn - ${currentFrameScore}`;
// }

function resetGameState(){  
  // player - game flow
  currentPlayerIndex = 0;
  currentRound = 1;
  currentFrameIndex = 0;
  rollInFrame = 1;
  gameOver = false;
  isRolling = false;
  // roll state
  firstRoll = null;
  secondRoll = null;
  isStrike = false;
  isSpare = false;
  rollProcessed = false;
  rollCounted = false;
  pinsSettled = true;
  pinsRemaining = 10;
  // score state
  totalScore = 0;
  playerTotals = [];
  currentHighestScore = -Infinity;
  currentWinnerIndex = 0;
  // rebuild per-player frame data properly later
  // ui / game flags
  frameEnded = false;
  ballInGutter = false;
}

function startGame(){
  rollInFrame = 1;
  firstRoll = null;
  secondRoll = null;
  isRolling = false;
  pinsRemaining = 10;
  // startGamePopup.style.display = "none";
  gameUI.style.display = "block";
}

function renderPlayerNames(){ 
  // console.log(playerDataArr);

  // for (let i = 0; i < player.length; i++) {
  //   const hasPlayer = playerDataArr[i];

  //   if (hasPlayer) {
  //     player[i].classList.remove("hidden");

  //     playerName[i].textContent = hasPlayer.name;
  //     playerScore[i].textContent = hasPlayer.score;
  //   } else {
  //     player[i].classList.add("hidden");
  //   }
  // }
  console.log(playerDataArr);
  for(let i = 0; i < playerDataArr.length; i++){
    const playerObj = playerDataArr[i];
    if(player[i]){
      player[i].classList.remove("hidden");
      playerName[i].textContent = playerObj.name;
      playerScore[i].textContent = playerObj.score;
    }
  }
  for(let i = playerDataArr.length; i < player.length; i++){
    player[i].classList.add("hidden");
  }
}

function loadFromLocalStorage(){
  const data = localStorage.getItem('playerDataArr');
  if(!data){
    return [];
  }
  try {
    let getData = JSON.parse(data); 
    playerDataArr = getData;
    return; 
  }
  catch(e){
    console.log("Corrupted storage data, resetting...");
    return [];
  }
}
 
function savePlayersToLocalStorage(){ 
  console.log("saving...");
  console.log(playerDataArr);
  localStorage.setItem("playerDataArr", JSON.stringify(playerDataArr));
}
 

document.addEventListener("DOMContentLoaded", () => {
  newX = (alley.offsetWidth - ballElem.offsetWidth) / 2;
  newY = alley.offsetHeight - ballElem.offsetHeight - 20;
  ballElem.style.left = newX + "px";
  ballElem.style.top = newY + "px";
});

function dragStart(event) {
  // // store pointer offset
  // if(gameOver) return;
  // ballState = "dragging";
  // stopBall = true;
  // isDragging = true;
  // // record the inititl mouse X position(startX)
  // // reocrd the balls current left positon
  // startX = event.clientX;
  // startY = event.clientY;
  // ballX = ballElem.offsetLeft;
  // ballY = ballElem.offsetTop;

  // // pointer offset inside the ball
  // pointerOffsetX = event.clientX - ballElem.offsetLeft;
  // pointerOffsetY = event.clientY - ballElem.offsetTop;

  if(gameOver) return;
  ballState = "dragging";
  stopBall = true;
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
  ballX = ballElem.offsetLeft;
  ballY = ballElem.offsetTop;
  pointerOffsetX = event.clientX - ballElem.offsetLeft;
  pointerOffsetY = event.clientY - ballElem.offsetTop;
}
function calculateBounds(){
  maxX = alley.offsetWidth - ballElem.offsetWidth;
  maxY = alley.offsetHeight - ballElem.offsetHeight;
}
function initGame(){
  calculateBounds();
  newX = (alley.offsetWidth - ballElem.offsetWidth) / 2;
  newY = alley.offsetHeight - ballElem.offsetHeight - 20;
  ballElem.style.left = newX + "px";
  ballElem.style.top = newY + "px";
}

// listen for pointermove on hte document
function dragMovement(event) {
  console.log(ballState);
  // // compute position, apply position
  // if(gameOver) return;
  // if (!isDragging) return; // revents movment if not draagging
  // // on each move
  // // calculate how far the mouse moved
  // // udpate the balls postion
  // // gives how far the pointer has moved from the start
  // deltaX = event.clientX - startX;
  // deltaY = event.clientY - startY;
  // // clamp here clamp(intendedX, min ,max) - caps value betwee nteh min and max limits
  // // intended positoin of the ball

  // // where the pointer is
  // // clamp
  // intendedX = event.clientX - pointerOffsetX;
  // intendedY = event.clientY - pointerOffsetY;

  // // maxX = alley.offsetWidth - ballElem.offsetWidth;
  // // maxY = alley.offsetHeight - ballElem.offsetHeight;

  // // only clamp horizontally
  // // let newY decrease naturally utnil you detect colliton of leave the alley
  // // newX = Math.min(Math.max(intendedX, 0), maxX);
  // // newY = Math.min(Math.max(intendedY, 0), maxY);
  // newX = Math.min(Math.max(intendedX, 0), maxX);
  // newY = Math.min(Math.max(intendedY, 0), maxY);
  
  // // ballElem.style.left = newX + "px";
  // // ballElem.style.top = newY + "px";
  // // ballElem.style.left = newX + "px";
  // // ballElem.style.top = newY + "px";

  // // detect collision. detect the ball reaching the alley

  // if(gameOver) return;
  // if(ballState !== "dragging") return;
  // intendedX = event.clientX - pointerOffsetX;
  // intendedY = event.clientY - pointerOffsetY;
  // newX = Math.max(0, Math.min(intendedX, maxX));
  // newY = Math.max(0, Math.min(intendedY, maxY));
  // ballElem.style.left = newX + "px";
  // ballElem.style.top = newY + "px";

  if(gameOver) return;
  if(!isDragging) return;
  // 1. read pointer position. event.clientX and event.clientY
  // 2. subtract offset
  // 3. clamp
  // 4. apply to ballElem.style.left/top
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  const intendedX = mouseX - pointerOffsetX;
  const intendedY = mouseY - pointerOffsetY;
  const maxX = alley.offsetWidth - ballElem.offsetWidth;
  const maxY = alley.offsetHeight - ballElem.offsetHeight;
  newX = Math.max(0, Math.min(intendedX, maxX));
  newY = Math.max(0, Math.min(intendedY, maxY));
  ballElem.style.left = newX + "px";
  ballElem.style.top = newY + "px";
}

function stopDrag() {
  // stopBall = false;
  // newX = ballElem.offsetLeft;
  // newY = ballElem.offsetTop;
  // isDragging = false;
  // requestAnimationFrame(rollBall);
  // isDragging = false;
  // // start rolling only if the ball is not already rolling
  // if(stopBall){
  //   stopBall = false;
  //   requestAnimationFrame(rollBall);
  // }

  if(gameOver) return;
  if(ballState !== "dragging") return;
  ballState = "rolling"; 
  isDragging = false;
  stopBall = false;
  requestAnimationFrame(rollBall);
}

function resetBallPosition() {
  newX = (alley.offsetWidth - ballElem.offsetWidth) / 2;
  newY = alley.offsetHeight - ballElem.offsetHeight - 20;
  ballElem.style.left = newX + "px";
  ballElem.style.top = newY + "px";
  rollCounted = false;
  pinsSettled = false;
  ballState = "idle";
  stopBall = true;
  stopLock = false;
  startNewRoll(); 
  cancelAnimationFrame(rollBall);
}
function rollBall() {
  console.log(ballState);
  // if(gameOver) return;
  // if(ballState !== "rolling") return;
  // newX += xSpeed;
  // newY += ySpeed;
  // newX = Math.max(0, Math.min(newX, alley.offsetWidth - ballElem.offsetWidth));
  // ballElem.style.left = newX + "px";
  // ballElem.style.top = newY + "px";
  // const ballRect = ballElem.getBoundingClientRect();
  // const alleyRect = alley.getBoundingClientRect();
  // bumpers();
  // knockPinsDown();
  // const hitTop = ballRect.top <= alleyRect.top;
  // const hitGutter = guttersEnabled() && inGutter();
  // if(hitTop || stopBall || hitGutter){
  //   ballState = "stopping";
  //   stopBall = true;
  //   setTimeout(() => {   
  //     gameScoring();
  //     resetBallPosition();
  //     checkFrameEnd();
  //   }, 500); 
  //   return;
  // }
  // // 
  // reqBall = requestAnimationFrame(rollBall);

  if(gameOver) return;
  if(ballState !== "rolling") return;
  // update newX
  // update newY
  // apply speed
  // clamp position if needed
  newX += xSpeed;
  newY += ySpeed;
  newX = Math.max(0, Math.min(newX, alley.offsetWidth - ballElem.offsetWidth));
  ballElem.style.left = newX + "px";
  ballElem.style.top = newY + "px";
  console.log(ballElem.style.left);
  console.log(ballElem.style.top);
  bumpers();
  knockPinsDown();

  // get ball position
  // get alley position
  let ballRect = ballElem.getBoundingClientRect();
  let alleyRect = alley.getBoundingClientRect();
  // compare positons
  const hitTop = ballRect.top <= alleyRect.top;
  const hitGutter = guttersEnabled() && inGutter();
  const shouldStop = hitTop || hitGutter;
  if(shouldStop && !stopLock){
    ballState = "stopping";
    stopLock = true;
    handleBallStop();
    
    return;
  }
  requestAnimationFrame(rollBall);
}
function finishRoll(){  
  gameScoring();
  checkFrameEnd();
  savePlayersToLocalStorage();
  updateUI();
  // resetPins();
  resetBallPosition();
}
function handleBallStop(){
  setTimeout(() => {
    finishRoll();
  }, 500);
}

function guttersEnabled() {
  return alley.classList.contains("use-gutters");
}

function bumpers() {
  // use this function inside your bumpers() logic
  // if gutters are enabled -> ball sotps wen it enters a gutter
  // if bumpers are enabled -> ball bounces off the walls, ignore gutter check
  if (guttersEnabled()) {
    // stop the ball if it enters a gutter
    if (inGutter()) {
      xSpeed = 0;
      return;
    }
  } else {
    if (newX <= 0 || newX >= alley.offsetWidth - ballElem.offsetWidth) {
      xSpeed = -xSpeed * 0.9;
    }
  }
}

// steps.
// clean up code. remove unused code
// learn how to use prettier and eslint
// scoring
// look into making the ball have a spin. a new setting in the game. 
// disabled, left and right

function inGutter() {
  // if the ball currently isnide each gutter zone
  // figure out where hte left edge of the ball is
  // figure out where the right edge of the ball
  let leftEdgeOfBall = ballElem.offsetLeft;
  // thiknk of right edge as = left position + width
  let rightEdgeOfBall = ballElem.offsetLeft + ballElem.offsetWidth;
  let getGutterLeft = gutterLeftElem.offsetWidth;
  let getGutterRight = alley.offsetWidth - gutterRightElem.offsetWidth;
  if (leftEdgeOfBall < getGutterLeft || rightEdgeOfBall > getGutterRight) {
    return true;
  }
  return false;
}

function toggleGuttersFunc(event) {
  if (guttersEnabled()) {
    alley.classList.remove("use-gutters");
    alley.classList.add("use-bumpers");
    stopBall = true;
    // when switching to bumpers mode
    //1. reset xSpeed to a positive or negative value (depedning on what direction you want)
    //2. reset ballInGutter to false
    //3. optionally set stopBall = false if you want to continue rolling
    xSpeed = 5;
    ballInGutter = false;
    stopBall = false;
  } else {
    console.log("bumpers are active");
    alley.classList.remove("use-bumpers");
    alley.classList.add("use-gutters");
    stopBall = true;
  }
}
toggleGuttersBtn.addEventListener("click", toggleGuttersFunc);

// angle the ball
function angleBall() {
  xSpeed = dragDeltaX * 0.1;
}

// knock pins down function
function knockPinsDown() {
  // when the ball makes contact with the pin, knock it down
  // class - add class .fall
  let getBall = ballElem.getBoundingClientRect();
  let getPins = [...pins];
  getPins.forEach((pin) => {
    let pinRect = pin.getBoundingClientRect();
    if (
      getBall.right > pinRect.left &&
      getBall.left < pinRect.right &&
      getBall.bottom > pinRect.top &&
      getBall.top < pinRect.bottom 
    ) {
      pin.classList.add("fall");
      pin.classList.add(`fallOnRoll${rollInFrame + 1}`)
    }
  });
}

// switch between players
function switchBetweenPlayers() {
  if(gameOver) return;
  if(playerDataArr.length === 0) return;
  currentPlayerIndex++;
  if(currentPlayerIndex > playerDataArr.length - 1){
    currentPlayerIndex = 0;
  }
}
function resetFrameState(){
  rollInFrame = 1;
  pinsRemaining = 10;
  rollProcessed = true;
  rollCounted = false;
  isStrike = false;
  isSpare = false;
  frameEnded = false;
} 
// keep track of scroring
function gameScoring(){
  // counting the fallen pins in each roll
  // checking if strike or a spare
  // subtracting the pins fallen from pinsRemaining
  // calling checkFrameEnd()
  let countPinsFallen = 0;
  for(let i = 0; i < pins.length; i++){
    if(pins[i].classList.contains("fall") && !pins[i].classList.contains("counted")){
      countPinsFallen++;
      pins[i].classList.add("counted");
      if(countPinsFallen >= 1){
        let bowlingSound = new Audio("./audio/bowling.mp3");
        bowlingSound.play();
      }
    }
  }
  if(rollInFrame === 1){
    currentFrame.roll1 = countPinsFallen;
  }
  else {
    currentFrame.roll2 = countPinsFallen;
  }
  // every roll i want to update ui

  const checkIsStrike = rollInFrame === 1 && countPinsFallen === 10;
  const checkIsSpare =
    rollInFrame === 2 &&
    (currentFrame.roll1 ?? 0) + countPinsFallen === 10;

  currentFrame.strike = checkIsStrike;
  currentFrame.spare = checkIsSpare;

  let currentRollScore;
  if(currentFrame.strike){
    currentRollScore = 10;
  }
  else {
    currentRollScore = countPinsFallen;
  }
  playerDataArr[currentPlayerIndex].score += currentRollScore;

  pinsRemaining -= countPinsFallen; 
  // currentFrameScore = (currentFrame.roll1 || 0) + (currentFrame.roll2 || 0);
  playerDataArr[currentPlayerIndex].rolls.push(countPinsFallen);
  console.log(playerDataArr);
}
function checkFrameEnd(){ 
  // if frame is done, end the frame
  if(currentFrame.strike || rollInFrame === 2){
    endFrame();
  }
  else if(!currentFrame.strike){
    rollInFrame++;
  }
}
function startNewRoll(){
  rollCounted = false;
  stopBall = false;
  pinsSettled = false;
  rollProcessed = false;
}
function endFrame(){
  if(isGameOver()){
    gameOver = true;
    gameWinner();  
    return;
  }
  console.log(currentFrame);
  // let getFrame;
  // if(currentFrame.strike){
  //   getFrame = 10;
  // }
  // else {
  //   getFrame = (currentFrame.roll1 || 0) + (currentFrame.roll2 || 0);
  // }
  // playerDataArr[currentPlayerIndex].score += getFrame;

  let copyCurrentFrame = {...currentFrame};
  playerDataArr[currentPlayerIndex].frames.push(copyCurrentFrame);

  console.log(playerDataArr);
  
  currentFrame = {
    roll1: null,
    roll2: null,
    spare: false,
    strike: false
  };
  resetPins();
  switchBetweenPlayers();
  // updateCurrentPlayer
  // updateUI();
  savePlayersToLocalStorage();
  resetFrameState();
}

function resetPins(){
  pins.forEach((pin) => {
    pin.classList.remove("fall");
    pin.classList.remove("counted");
  });
}
function isGameOver(){
  for(let i = 0; i < playerDataArr.length; i++){
    console.log(playerDataArr[i]);
    if(playerDataArr[i].frames.length < 10){
      return false;
    }
  }
  return true;
}

function updateUI(){
  for(let i = 0; i < playerDataArr.length; i++){
    playerScoreElem[i].innerHTML = playerDataArr[i].score;
    console.log("update ui");
    console.log(playerDataArr[i].score);
  }
  player.forEach((currPlayer) => {
    currPlayer.classList.remove("active");
  });
  player[currentPlayerIndex].classList.add("active");

  console.log(player);
  // currentPlayerElem.innerHTML = playerDataArr[currentPlayerIndex].name;
}

// show winner
function gameWinner() {
  if(displayTie()){
    return;
  }
  // compare each players score
  // keep track of player with the hihghest score
  // get the fisrt score
  let highestScore = playerDataArr[0].score;
  let winner = playerDataArr[0].name;
  // loop oer the plaeyrdataAr
  for(let i = 1; i < playerDataArr.length; i++){
    let currentPlayer = playerDataArr[i];
    // is hte current player's score
    // greater than the hghest sore yu have seen so ar
    if(currentPlayer.score > highestScore){
      highestScore = currentPlayer.score;
      winner = currentPlayer.name;
    }
  }
  // update ui
  gameOverOverlay.classList.add("show");
  winnerDisplay.classList.remove("hidden");
  winnerName.innerHTML = winner;
  winnerScore.innerHTML = `The score is ${highestScore} and the winner is ${winner}`;
  winnerScore.style.color = "white";
  winnerEmoji.innerHTML = "🎉";
  winnerEmoji.style.fontSize = "20px";
  
  addToHallOfFame(winner, highestScore);
  renderHallOfFame();
}
function displayTie(){
  let isTie = true;
  // get first players score
  // loop through other players
  // compare scores
  // if the loop finishes and nobody was different
  let firstPlayerScore = playerDataArr[0].score;
  console.log(`The first players score is ${firstPlayerScore}`);
  for(let i = 1; i < playerDataArr.length; i++){
    let currentPlayerScore = playerDataArr[i].score;
    console.log(`The curent player score is ${currentPlayerScore}`);
    if(firstPlayerScore !== currentPlayerScore){
      isTie = false;
      break;
    }
  }
  if(isTie){
    console.log("IT is a tie");
    winnerScore.innerHTML = `The game is a tie!`;
  }
}
function restartGame(){
  // stop the game
  gameOver = false; 
  frameEnded = false;
  isRolling = false;
  // reset player turn state
  currentPlayerIndex = 0;
  rollInFrame = 1;
  // reset roll state
  firstRoll = 0;
  secondRoll = 0;
  isStrike = false;
  isSpare = false;
  // reset scoring trackers
  playerTotals = [];
  currentHighestScore = -Infinity;
  currentWinnerIndex = 0;
  grandTotal = 0;
  totalScore = 0;
  // reset frame data
  playerDataArr.length = 0;
  // reset board state
  resetPins(); 
  resetBallPosition();
  // reset ui scores
  playerScore.forEach(currScore => {
    currScore.innerHTML = 0;
  });
  // reset winner UI
  winnerText.innerHTML = 'TBD'; 
  // reset current player UI
}

function gameOverModal(){
  gameOverOverlay.classList.add("show");
  winnerText.innerHTML = playerDataArr[i] + " Won";
  if(gameOver){
    goBackToChoosingPlayers();
  }
}
function goBackToChoosingPlayers(){
  startGamePopup.classList.add("show");
}

// only dispaly sound when pins are knocked down

function closeModal(){
  // this function is what happens when restart game
  gameOverOverlay.classList.remove("show");
  restartGame();
  startGamePopup.classList.remove('hidden');
  hallOfFame.classList.add("hidden");
  gameUI.classList.add("hidden");
  toggleGuttersBtn.classList.add("hidden");
  restartGame.classList.add("hidden");
}
// hall of fame function go here
function loadHallOfFame(){
  console.log("Load hall of fame function");
  // ask localStorage. Do i have hallOfFame saved
  // if yes -> convert it back to an array 
  // if no -> make hallOfFame an empty array
  let hallOfFameData = localStorage.getItem("hallOfFame");
  if(hallOfFameData){
    hallOfFame = JSON.parse(hallOfFameData);
  }
  else {
    hallOfFame = [];
  }
}
function saveHallOfFame(){
  console.log("Save hall of fame function");
  // take the hallOfFame array
  // convert into a string
  // store in localStora
  localStorage.setItem("hallOfFame", JSON.stringify(hallOfFame));
}
function addToHallOfFame(winner, highestScore){
  // and player scores to hallOfFame array
 hallOfFame.push({
  id: Date.now(),
  name: winner,
  score: highestScore,
  // date: new Date().toLocaleDateString(),
  date: new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
 });
 // sort the highest scores
 hallOfFame.sort((a,b) => b.score - a.score);
 // sort the highest scores
 hallOfFame = hallOfFame.slice(0, 5);
 saveHallOfFame();
}
function renderHallOfFame(){
  console.log("Render hall of fame function");
  console.log(hallOfFame);
  if(hallOfFame.length === 0){
    console.log("Hall of fame is empty");
    hallOfFameDiv.innerHTML = `<p>No Players Yet</p>`;
    hallOfFameDiv.style.color = "white";
    hallOfFameDiv.style.textAlign = "center";
    return;
  }
  
  let updateScore = 0;
  console.log("renderHallOfFame was called");
  // clear hall of fame div
  // sort array of objects by largest
  hallOfFameDiv.innerHTML = "";
  console.log(hallOfFameDiv.innerHTML);
  const sortByLargest = hallOfFame.sort((a,b) => {
    if(a.score < b.score){
      return 1;
    }
    else {
      return -1;
    }
  });
  let sliceArr = sortByLargest.slice(0,5);
  for(let i = 0; i < sliceArr.length; i++){
    // add medals for the top 3
    // format scores better
    // add empty state
    // add highlighing for the newest score
    // make sure it always displays sorted correctly
    console.log(sliceArr[i]);
    

    // for each player:
    //1. create a row
    //2. create the pieces
    //3. put the pieces into hte row
    //4. put the row into hallOfFameDiv
    let rowEl = document.createElement("div");
    rowEl.classList.add("rowEl");
    updateScore++;
    let holdTopScores = document.createElement("p");
    if(i === 0){
      // give #1 medal
      holdTopScores.innerHTML = `🥇`;
    }
    if(i === 1){
      // give #2 medal
      holdTopScores.innerHTML = `🥈`;
    }
    if(i === 2){
      // give #3 medal
      holdTopScores.innerHTML = `🥉`;
    }
    holdTopScores.classList.add("medal");
    let rankEl = document.createElement("p");
    let playerNameEl = document.createElement("p");
    let scoreEl = document.createElement("p");
    let dateEl = document.createElement("p");
    
    rankEl.innerHTML = updateScore + ".";
    rankEl.classList.add("rank");
    playerNameEl.innerHTML = sliceArr[i].name;
    playerNameEl.classList.add("player-name");
    scoreEl.innerHTML = sliceArr[i].score;
    scoreEl.classList.add("score");
    dateEl.innerHTML = sliceArr[i].date;
    dateEl.classList.add("date");
    
    rowEl.appendChild(holdTopScores);
    rowEl.appendChild(rankEl);
    rowEl.appendChild(playerNameEl);
    rowEl.appendChild(scoreEl);
    rowEl.appendChild(dateEl);
    
    hallOfFameDiv.appendChild(rowEl);
  } 
  
};


restartBtn.addEventListener("click", closeModal);
ballElem.addEventListener("pointerdown", dragStart);
document.addEventListener("pointermove", dragMovement);
document.addEventListener("pointerup", stopDrag);