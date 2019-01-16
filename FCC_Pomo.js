var sessionLength;
var breakLength;
var seconds;
var timerRunning = false;
var myTimer;
var minutes;
var seconds;
var session = "SESSION";
var timer;
var previousSession;
var beepNoise = document.getElementById("beep");
var defaultSession = 25 * 60 * 1000;
var defaultBreak = 5 * 60 * 1000;

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function buttonPress(action) {
  switch (action) {
    case "BREAKDECREASE":
      if (!timerRunning){
        breakLength-=60000;
        if (breakLength/60000 <= 0){
          breakLength = 60000;
        }
        updateDOM("BREAK");
      }
      break;
    case "BREAKINCREASE":
      if (!timerRunning){
        breakLength+=60000;
        if (breakLength > 60000*60){
          breakLength = 60*60000;
        }
        updateDOM("BREAK");
      }
      break;
    case "SESSIONDECREASE":
      if (!timerRunning){
        sessionLength -= 60000;
        if (sessionLength <= 0){
          sessionLength = 60000;
        }

        if (previousSession==="SESSION") {
          timer=sessionLength;
          seconds="00";
        }

        updateDOM("SESSION");
      }
      break;
    case "SESSIONINCREASE":
      if (!timerRunning){
        sessionLength+=60000;
        if (sessionLength > 60*60000){
          sessionLength = 60*60000;
        }

        if (previousSession==="SESSION") {
          seconds="00";
          timer=sessionLength;
        }

        updateDOM("SESSION");;
      }
      break;
    case "RESET":
      resetTimer();
      break;
    case "STARTSTOP":
      if (timerRunning){
        stopTimer();
      } else {
        if (session==="SESSION") {
          startTimer(sessionLength);
        } else if (timerRunning === "BREAK") {
          startTimer(breakLength);
        } else {
          startTimer(timer);
        }
      }
  }
}

function stopTimer(timerValue){
  clearInterval(myTimer);
  console.log(timer);
  previousSession = session;
  session = "PAUSED";
  timerRunning = false;
  document.getElementById("timer-label").innerHTML = "Paused";
}

function startTimer(timerValue){
  session = previousSession;
  timer = timerValue;
  timerRunning = true;

  if (session==="SESSION") {
    document.getElementById("timer-label").innerHTML = "Working";
  } else {
    document.getElementById("timer-label").innerHTML = "On a Break";
  }
  myTimer = setInterval(function() {
  //decrease timer by 1s
  timer -= 1000;

  // Time calculations for minutes and seconds
  minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((timer % (1000 * 60)) / 1000);

  // Display the result in the element with id="time-left"
  document.getElementById("time-left").innerHTML =  minutes.pad(2) + ":" + seconds.pad(2);

  // If the count down is finished, move on to next timer
  if (timer === 0) {
    beepNoise.play();
    console.log(session);
    clearInterval(myTimer);
    if (session==="BREAK") {
      previousSession = "SESSION";
      startTimer((sessionLength ) + 60000/60);
    } else {
      previousSession = "BREAK";
      startTimer((breakLength) + 60000/60);
    }
  }
}, 1000);
}

function resetTimer() {
  if (timerRunning){
    stopTimer();
  }
  beepNoise.pause();
  beepNoise.currentTime = 0;
  document.getElementById("timer-label").innerHTML = "Not Running";
  session = "SESSION";
  previousSession = session;
  sessionLength = defaultSession;
  breakLength = defaultBreak;
  seconds="00";
  updateDOM("SESSION");
  updateDOM("BREAK");
}

function updateDOM(domID) {
  switch (domID) {
    case "SESSION":
      minutes = Math.floor((sessionLength % (1000 * 60 * 60)) / (1000 * 60));
      if (minutes===0){
        minutes=60;
      }
      document.getElementById("session-length").innerHTML = minutes;
      document.getElementById("time-left").innerHTML = minutes + ":" + seconds;
      break;
    case "BREAK":
      minutes = Math.floor((breakLength % (1000 * 60 * 60)) / (1000 * 60));
      if (minutes===0){
        minutes=60;
      }
      document.getElementById("break-length").innerHTML = minutes;
      break;
  }
}


window.onload=resetTimer();
