var sessionLength;
var breakLength;
var timerRunning = false;
var myTimer;
var minutes;
var seconds;
var session = "SESSION";
var timer;
var previousSession;
var beepNoise = document.getElementById("beep");
var defaultSession = 25 * 60 * 1000; //defaults "SESSION" duration to 25 minutes
var defaultBreak = 5 * 60 * 1000; //defaults "BREAK" duration to 5 minutes

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function buttonPress(action) {
  switch (action) {
    case "BREAKDECREASE":
      if (!timerRunning){ //if timer is running dont do anything
        breakLength-=60000; //decrease the "BREAK" duration by 1 minute
        if (breakLength/60000 <= 0){
          breakLength = 60000; //"BREAK" duration must be > 0
        }
        updateDOM("BREAK"); //update the DOM for "BREAK"
      }
      break;
    case "BREAKINCREASE":
      if (!timerRunning){ //if timer is running dont do anything
        breakLength+=60000;  //increase the "BREAK" duration by 1 minute
        if (breakLength > 60000*60){
          breakLength = 60*60000; //"BREAK" duration must be <= 60
        }
        updateDOM("BREAK"); //update the DOM for "BREAK"
      }
      break;
    case "SESSIONDECREASE":
      if (!timerRunning){ //if timer is running dont do anything
        sessionLength -= 60000; //decreae the "SESSION" duration by 1 minute
        if (sessionLength <= 0){
          sessionLength = 60000; //"SESSION" duration must be > 0
        }

        if (previousSession==="SESSION") { //if user increases time during timer pause then specialy code to correct display
          timer=sessionLength;
          seconds="00";
        }

        updateDOM("SESSION"); //Update the DOM for "SESSION"
      }
      break;
    case "SESSIONINCREASE":
      if (!timerRunning){ //if timer is running dont do anything
        sessionLength+=60000; //increase the "SESSION" duration by 1 minute
        if (sessionLength > 60*60000){
          sessionLength = 60*60000; //"SESSION" duration must be <= 60
        }

        if (previousSession==="SESSION") { //if user increases time during timer pause then specialy code to correct display
          seconds="00";
          timer=sessionLength;
        }

        updateDOM("SESSION");; // Update the DOM for "SESSION"
      }
      break;
    case "RESET": // user clicks RESET button
      resetTimer();
      break;
    case "STARTSTOP": //user clicks START/STOP button
      if (timerRunning){
        stopTimer(); // if the timer is running stop it
      } else {
        if (session==="SESSION") {
          startTimer(sessionLength); //start timer with SESSION duration
        } else if (timerRunning === "BREAK") {
          startTimer(breakLength); //start timer with BREAK duration
        } else {
          startTimer(timer); // restart during pause - start from TIMER (ie where we paused)
        }
      }
  }
}

function stopTimer(timerValue){
  clearInterval(myTimer); //stop the timer

  previousSession = session;//note the duration we were tunning (ie SESSION or BREAK)
  session = "PAUSED"; //note timer is now paused
  timerRunning = false; //timer stopped
  document.getElementById("timer-label").innerHTML = "Paused"; //update screen to show pause
}

function startTimer(timerValue){
  session = previousSession; //go back to where we were before the pause
  timer = timerValue; //reset the timer to the right value
  timerRunning = true; //note the timer is running

  if (session==="SESSION") { //set the correct desicription for the timer
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

    clearInterval(myTimer);

    // move to next timer & trigger counter
    if (session==="BREAK") {
      previousSession = "SESSION";
      startTimer(sessionLength+1000);
    } else {
      previousSession = "BREAK";
      startTimer(breakLength+1000);
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

  //set all default values;
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
        minutes=60; //60 * 60000 (ie 1 hour) derives to 1 hour 0 minutes in above so need to make it 60
      }
      document.getElementById("session-length").innerHTML = minutes;
      document.getElementById("time-left").innerHTML = minutes.pad(2) + ":" + seconds;
      break;
    case "BREAK":
      minutes = Math.floor((breakLength % (1000 * 60 * 60)) / (1000 * 60));
      if (minutes===0){
        minutes=60; //60 * 60000 (ie 1 hour) derives to 1 hour 0 minutes in above so need to make it 60
      }
      document.getElementById("break-length").innerHTML = minutes;
      break;
  }
}


window.onload=resetTimer();
