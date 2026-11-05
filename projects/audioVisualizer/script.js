// styling - make the playlist section have a darker color


let audioInput = document.getElementById("audio");
let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let songTitle = document.getElementById("songTitle");
let currentSong = document.getElementById("currentSong");
let playlistContainer = document.querySelector(".playlist");
const volumeSlider = document.getElementById("volumeSlider");
let currentTime = document.getElementById("currentTime");
let progressBar = document.getElementById("progressBar");
let totalTime =  document.getElementById("totalTime"); 
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
// ways to make this more end
// create playlists  
// drag and drop favorite songs thing
// add artwork for the songs 
// group them in albums 
// add storage(local storage)
// look at itunes / music players

let bufferSource;
let currentSongIndex = 0;
// audioContext
// createAnalyser
// holdFreqData
// canvas + canvasContext
let audioContext;
let createAnalyser;
let holdFreqData;
let canvas;
let canvasContext;
let audioBuffer;

let currentSource = null;
let getDuration;

// playback tracking variables

// when did the song start?
let startTime = 0; 
// where did the user pause?
let pausedAt = 0;
// current state
let isPlaying = false;
let isStopping = false;
let timer = null;
let gainNode;

let timeString;

let playlist = [];

document.addEventListener("DOMContentLoaded", () => {
    // handlePlaylist();

    pauseBtn.addEventListener("click", pauseButtonFunc);
    playBtn.addEventListener("click", playButtonFunc);

    pauseBtn.disabled = false;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    gainNode = audioContext.createGain();
    createAnalyser = audioContext.createAnalyser();
    createAnalyser.fftSize = 256;
    createAnalyser.smoothingTimeConstant = 0.8;
    holdFreqData = new Uint8Array(createAnalyser.frequencyBinCount);
    gainNode.connect(createAnalyser);
    createAnalyser.connect(audioContext.destination);

    canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 200;
    canvasContext = canvas.getContext("2d");

    currentSource = null;
    draw();
});

// moved content out of audio
// audioContext
// analyser
// draw()
// and make them exist ONCE at the top

// push track into playlist
// play -> pull from playlist
audioInput.addEventListener("change", (event) => {
    let file = event.target.files[0];
    let fileName = file.name;
    console.log(playlist);
    console.log(`The file name is ${fileName}`);
    let reader = new FileReader();
    reader.addEventListener("load", (event) => {
        let arrayBuffer = event.target.result;
        // loadSong(arrayBuffer, fileName);
        // audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(arrayBuffer, function(audioBuffer){
            loadSong(audioBuffer, fileName);
            displayPlaylist();

            
            formatTime();
        });
    });
    reader.readAsArrayBuffer(file);
});

function loadSong(audioBuffer, fileName){
    // track object should contain the following:
    // 1. audioBuffer
    // 2. fileName
    // 3. duration
    // 4. artwork
    // 5. id
    let trackObject = {
        audioBuffer,
        fileName,
        duration: audioBuffer.duration,
        artwork: "",
        id: crypto.randomUUID(),
    }
    
    playlist.push(trackObject);
    console.log(playlist);
}

function draw(){
    createAnalyser.getByteFrequencyData(holdFreqData);
    canvasContext.clearRect(0,0,canvas.width, canvas.height); 
    canvasContext.fillStyle = "#5a4fcf";
    let barWidth = canvas.width / holdFreqData.length;
    console.log(barWidth);
    for(let i = 0; i < holdFreqData.length; i++){
        let frequencyData = holdFreqData[i];
        let barHeight = frequencyData * 0.5;
        let x = i * barWidth;
        let y = canvas.height - barHeight;
        canvasContext.fillRect(x, y, barWidth, barHeight);
    }
    // use to loop this function and update the visualization smoothing
    requestAnimationFrame(draw);
}

function playButtonFunc(){
    // are there songs?
    // NO -> stop
    // yes -> is something playing?
    // YES - do nothing
    // NO - create newSource
    if(playlist.length === 0){
        console.log("There are no songs");
        return;
    }
    if(!isPlaying){
        createNewSource();
    }
}
function displayCurrentSong(){
    if(playlist.length === 0){
        currentSong.innerHTML = "No song selected";
        return;
    }
    // // highlight the selected song
    if(playlist.length > 0){
        let currSong = playlist[currentSongIndex].fileName;
        currentSong.innerHTML = currSong;
    }
}
function startSongIndex(index){
    // Responsible for playing the songs
    
    // set current song index using the variable passed in X
    // call display current song X
    // update the total time with the formatTime function
    // do some of the playback management(stop the current source ,etc)
    // reset your pausedAt variable
    // start the playback for the selected song

    //1. set currentSongIndex
    //2. display the currentSong - displayCurrentSong()
    //3. display - formatTime()
    //4. stop old source
    //5. clear old source reference
    //6. reset pausedAt
    //7. get selected audio buffer
    //8. create new bufferSource
    //9. put audioBuffer into source
    //10. connect source -> gainNode
    //11. start source at pausedAt
    //12. isPlaying = true
    //13. start timer
    currentSongIndex = index;
    highlightCurrentSong();
    displayCurrentSong();
    formatTime();
    if(currentSource){
        isStopping = true;
        currentSource.stop();
        currentSource = null;
    }
    stopCurrentTime();
    pausedAt = 0;
    createNewSource();
    // let getCurrentSong = playlist[currentSongIndex].audioBuffer;
    // console.log("GET THE CURRENT SONG");
    // console.log(getCurrentSong);
    // currentSource = audioContext.createBufferSource();
    // currentSource.buffer = getCurrentSong;
    // currentSource.connect(gainNode);
    // // startTime = audioContext.currentTime;
    // // currentSource.start(audioContext.currentTime, pausedAt);
    // startTime = audioContext.currentTime;
    
    // currentSource.start(audioContext.currentTime, pausedAt);
    
    // isPlaying = true;
    // showAndPlayTime();
}
function displayPlaylist(){
    songTitle.innerHTML = "";
    for(let i = 0; i < playlist.length; i++){
        let holdSongs = document.createElement("li");
        holdSongs.style.listStyle = "none";
        holdSongs.innerHTML = playlist[i].fileName;
        holdSongs.addEventListener("click", () => {
            startSongIndex(i);
        });
        songTitle.appendChild(holdSongs);
    }
}
function pauseButtonFunc(){
    //1. log the pause that was clicked
    //2. check if there is a current source
    // if there isnt one playing, there is nothing to pause
    //3. calculate how many seconds have elapsed
    // since this playback has started
    //4. add that elapsedTime into pausedAt
    //4. stop the current source
    // rremmeber AudioBufferSourceNode cannot be paused
    // you stop it and create a new one when resuming
    //6. set currentSource to null
    //7. stop the timer
    // clear the interval, set time back to null
    //8. set isPlaying to false
    //9. make sure isStopping is set correctly
    // you dont want your intentional pause
    // to trigger nextSong() through onended
    // test the value of pausedAt
    // console.log("Pause button was clicked");
    // if(!currentSource){
    //     console.log("There is no source to pause");
    //     return;
    // }
    // if(currentSource){
    //     //1. calculate the elapsed time X
    //     //2. updated pausedAt X
    //     //3. mark this as an intentional stop
    //     //4. stop source
    //     //5. set source to null
    //     let elapsedTime = audioContext.currentTime - startTime;
    //     pausedAt += elapsedTime;
    //     console.log(`PausedAt is: ${pausedAt}`);
    //     isStopping = true;
    //     currentSource.stop();
    //     currentSource = null;
        
    //     clearInterval(timer);
    //     timer = null;
    //     isPlaying = false;
    //     console.log("I'm not playing anymore");
    // }

    console.log("Pause button clicked");
    if(!currentSource){
        console.log("There is no source to pause");
        return;
    }
    let elapsedTime = audioContext.currentTime - startTime;
    pausedAt += elapsedTime;
    console.log(`PausedAt is: ${pausedAt}`);
    isStopping = true;
    currentSource.stop();
    currentSource = null;
    clearInterval(timer);
    timer = null;
    isPlaying = false;
    console.log("I'm not playing anymore");
}
function formatTime(){
    console.log("formatTime ran");
    console.log(`index: ${currentSongIndex}`);
    // steps from the jump
    //1. get the duration
    //2. get whole minutes
    //3. get remaining seconds

    let songDurationSeconds = playlist[currentSongIndex].duration;
    let wholeMinutes = (songDurationSeconds / 60);
    wholeMinutes = Math.trunc(wholeMinutes);
    let remainingSeconds = (songDurationSeconds % 60);
    remainingSeconds = Math.trunc(remainingSeconds);
    let formatMinutes = wholeMinutes.toString().padStart(2, "0");
    let formatSeconds = remainingSeconds.toString().padStart(2, "0");
    timeString = `${formatMinutes}:${formatSeconds}`;
    console.log(`the total time is: ${totalTime.innerHTML}`);
    totalTime.innerHTML = timeString;
}
// TODO. check and see if you need to extract the setInterval
// function out of the showAndPlayTime function
function showAndPlayTime(){
    clearInterval(timer);
    timer = null;
    // TODO. figure out what is restarting the play of the time
    timer = setInterval(() => {
        console.log(`pausedAt: ${pausedAt}`);
        console.log(`elapsed: ${audioContext.currentTime - startTime}`);
        let getElapsedTime = (audioContext.currentTime - startTime) + pausedAt;
        getElapsedTime = Math.trunc(getElapsedTime);
        
        console.log(`The current time is: ${audioContext.currentTime}`);
        console.log(`The start time is: ${startTime}`);
        console.log(`paused at is: ${pausedAt}`);

        // minutes + seconds
        // formatted string
        // currentTime.innerHTML = foramttedString
        let secondsToMinutes = Math.floor(getElapsedTime / 60);
        let remainingSeconds = getElapsedTime % 60;
        let formatMinutes = String(secondsToMinutes).padStart(2, "0");
        let formatSeconds = String(remainingSeconds).padStart(2, "0");
        let formatted = `${formatMinutes}:${formatSeconds}`;
        // formatting goes here
        console.log(formatted);
        currentTime.innerHTML = formatted;

        console.log(currentTime);
        console.log(totalTime);
        // add a statement that checks if current time
        // is equal to the total time
        if(currentTime.innerHTML === totalTime.innerHTML){
            console.log(true);
            clearInterval(timer);
            timer = null;
        }

        // progress bar code here
        updateProgressBar(getElapsedTime);
    }, 1000);

}
function updateProgressBar(getElapsedTime){
    if(!playlist[currentSongIndex]){
        console.log("No current song");
        return;
    }
    let currentTime = getElapsedTime;
    let duration = playlist[currentSongIndex].duration;
    let percentage = (currentTime / duration) * 100;
    progressBar.value = percentage;

}
function stopCurrentTime(){
    // clearInterval(timer);
    // timer = null;
    // pausedAt = 0;
    // progressBar.value = 0;
    // currentTime.innerHTML = "00:00";
    clearInterval(timer);
    timer = null;
    progressBar.value = 0;
    currentTime.innerHTML = "00:00";
}
function stopCurrentSong(){
    if(currentSource){
        currentSource.stop();
        currentSource = null;
    }
    stopCurrentTime();
}
// function stopTime(){
//     // convert both times from MM:SS format into totla seconds
//     // by multiplying the minuts by 60 and adding the 
//     // reainng seconds. 
//     // then compare the two total seconds values
//     // to see if they are equal
//     const [currMinutes, currSeconds] = currentTime.innerHTML.split(":");
//     const [totalMinutes, totalSeconds] = totalTime.innerHTML.split(":");
//     let curr = (Number(currMinutes) * 60) + Number(currSeconds);
//     let total = (Number(totalMinutes) * 60) + Number(totalSeconds);
//     if(Number(curr) === Number(total)){
//         console.log("Stop time function");
//         clearInterval(timer);
//         timer = null;
//     }
// }
function seekSong(){
    // user moves slider
    // calculate seconds
    // save seconds as pausedAt
    // deal with OLD source
    // use your new source
    // start at pausedAt
    // let percentage = progressBar.value;
    // let songDuration = playlist[currentSongIndex].duration;
    // let seconds = (percentage / 100) * songDuration;
    // pausedAt = seconds;
    // // take seconds and update your current time display
    // // with it in our exisitng minutes:seconds format
    // console.log(`The seconds are: ${seconds}`);
    // let getMinutes = Math.trunc(seconds / 60);
    // let getSeconds = seconds % 60;
    // getSeconds = Math.trunc(getSeconds);
    // let paddedMinutes = String(getMinutes).padStart(2, "0");
    // let paddedSeconds = String(getSeconds).padStart(2, "0");
    
    // let str = `${paddedMinutes}:${paddedSeconds}`;
    // console.log(`The formatted string is: ${str}`);
    // currentTime.innerHTML = str;
    // if(currentSource){
    //     isStopping = true;
    //     currentSource.stop();
    //     currentSource = null;
    //     clearInterval(timer);
    //     timer = null;
    // }
    // createNewSource();
    
    // hints from the jump
    // get the slider value
    // let percentage = Number(progressBar.value);
    // let songDuration = playlist[currentSongIndex].duration;

    // let seconds = (percentage / 100) * songDuration;

    // pausedAt = seconds;

    // // update the displayed time
    // let getMinutes = Math.trunc(seconds / 60);
    // let getSeconds = Math.trunc(seconds % 60);

    // let paddedMinutes = String(getMinutes).padStart(2, "0");
    // let paddedSeconds = String(getSeconds).padStart(2, "0");

    // currentTime.innerHTML = `${paddedMinutes}:${paddedSeconds}`;

    // // only restart the source if we were already playing
    // if(currentSource){

    //     isStopping = true;

    //     currentSource.stop();
    //     currentSource = null;

    //     clearInterval(timer);
    //     timer = null;

    //     isPlaying = false;

    //     createNewSource();
    // }

    let percentage = Number(progressBar.value);
    let songDuration = playlist[currentSongIndex].duration;
    pausedAt = (percentage / 100) * songDuration;
    let minutes = Math.trunc(pausedAt / 60);
    let seconds = Math.trunc(pausedAt % 60);
    currentTime.innerHTML = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    if(!isPlaying) return;
    isStopping = true;
    currentSource.stop();
    currentSource = null;
    clearInterval(timer);
    timer = null;
    createNewSource();
}
progressBar.addEventListener("change", seekSong);
function changeVolume(){
    gainNode.gain.value = Number(volumeSlider.value) / 100;
}
volumeSlider.addEventListener("input", changeVolume);

function createNewSource(){
    currentSource = audioContext.createBufferSource();
    currentSource.buffer = playlist[currentSongIndex].audioBuffer;
    currentSource.connect(gainNode);

    // isStopping = false;

    startTime = audioContext.currentTime;
    currentSource.start(audioContext.currentTime, pausedAt);
    
    showAndPlayTime();
    isPlaying = true;
    currentSource.onended = (event) => {
        console.log("Song finished");
        if(isStopping) return;
        isPlaying = false;
        clearInterval(timer);
        timer = null;
        // currentTime.innerHTML = totalTime.innerHTML;
        // progressBar.value = 100;
    }
}
function nextSong(){
    console.log("You clicked on the next song button");
    //1. is there a playlist?
    //2. stop the current source if one is playing
    //3. move currentSongIndex forward
    //4. wrap back to 0 if your past the last song
    //5. reset pausedAt
    //6. update the ui
    //7. create the new source
    if(playlist.length === 0){
        console.log("The playlist is empty");
        return;
    }
    
    if(currentSource){
        currentSource.stop();
        isStopping = true;
    }
    currentSongIndex++;
    if(currentSongIndex >= playlist.length){
        currentSongIndex = 0;
    }
    highlightCurrentSong();
    pausedAt = 0;
    displayCurrentSong();
    createNewSource();
}

function prevSong(){
    // check playlist
    if(playlist.length === 0){
        console.log("There are no songs in the playlist");
        return;
    }
    // stop old source
    // move index backward X
    // wrap around
    // pausedAt = 0;
    // displayCurrentSong
    // foramtTime()
    // createNewSource
    if(currentSource){
        isStopping = true;
        currentSource.stop();
    }
    currentSongIndex--;
    if(currentSongIndex < 0){
        currentSongIndex = playlist.length - 1;
    }
    highlightCurrentSong();
    pausedAt = 0;
    displayCurrentSong();
    formatTime();
    createNewSource();
}
function highlightCurrentSong(){
    console.log("Highlight song function");
    let currentSong = Array.from(songTitle.children);
    console.log(currentSong);
    currentSong.forEach(currSong => {
        currSong.classList.remove("highlight");
    });
    let addHighlight = currentSong[currentSongIndex].classList.add("highlight");
    console.log(addHighlight);
}


nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);



