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


Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function buttonPress(action) {
  switch (action) {
    case "BREAKDECREASE":
      if (!timerRunning){
        breakLength--;
        if (breakLength <= 0){
          breakLength = 1;
        }
        updateDOM("BREAK");
      }
      break;
    case "BREAKINCREASE":
      if (!timerRunning){
        breakLength++;
        if (breakLength > 60){
          breakLength = 60;
        }
        updateDOM("BREAK");
      }
      break;
    case "SESSIONDECREASE":
      if (!timerRunning){
        sessionLength--;
        if (sessionLength <= 0){
          sessionLength = 1;
        }

        if (previousSession==="SESSION") {
          timer=sessionLength * 60000;
          seconds="00";
        }

        updateDOM("SESSION");
      }
      break;
    case "SESSIONINCREASE":
      if (!timerRunning){
        sessionLength++;
        if (sessionLength > 60){
          sessionLength = 60;
        }

        if (previousSession==="SESSION") {
          seconds="00";
          timer=sessionLength * 60000;
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
          startTimer(sessionLength * 60000);
        } else if (timerRunning === "BREAK") {
          startTimer(breakLength * 60000);
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
  timer -= (60000/60);

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
      startTimer((sessionLength * 60000) + 60000/60);
    } else {
      previousSession = "BREAK";
      startTimer((breakLength * 60000) + 60000/60);
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
  sessionLength = "25";
  breakLength = "5";
  seconds="00";
  updateDOM("SESSION");
  updateDOM("BREAK");
}

function updateDOM(domID) {
  switch (domID) {
    case "SESSION":
      document.getElementById("session-length").innerHTML = sessionLength;
      document.getElementById("time-left").innerHTML = sessionLength + ":" + seconds;
      break;
    case "BREAK":
      document.getElementById("break-length").innerHTML = breakLength;
      break;
  }
}


window.onload=resetTimer();
