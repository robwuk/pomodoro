var sessionLength;
var breakLength;
var seconds;
var timerRunning = false;
var distance;
var myTimer;
var minutes;
var seconds;
var session = true;
var timer;

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function buttonPress(action) {
  switch (action) {
    case "BREAKDECREASE":
      breakLength--;
      if (breakLength < 0){
        breakLength = 0;
      }
      updateDOM("BREAK");
      break;
    case "BREAKINCREASE":
      breakLength++;
      if (breakLength > 60){
        breakLength = 60;
      }
      updateDOM("BREAK");
      break;
    case "SESSIONDECREASE":
      sessionLength--;
      if (sessionLength < 0){
        sessionLength = 0;
      }
      updateDOM("SESSION");
      break;
    case "SESSIONINCREASE":
      sessionLength++;
      if (sessionLength > 60){
        sessionLength = 60;
      }
      updateDOM("SESSION");;
      break;
    case "RESET":
      resetTimer();
      break;
    case "STARTSTOP":
      if (timerRunning){
        stopTimer();
      } else {
        if (session) {
          startTimer(sessionLength);
        } else {
          startTimer(breakLength);
        }
      }


  }
  console.log(action);
}

function stopTimer(timerValue){
  timerRunning = false;
  if (session) {
    sessionLength = minutes + (seconds/60);
  } else {
    breakLength = minutes + (seconds/60);
  }
  clearInterval(myTimer);
}

function startTimer(timerValue){
  timer = timerValue;
  timerRunning = true;
  var startTime = new Date().getTime();
  var endTime = new Date(startTime + timer*60000);

  myTimer = setInterval(function() {

  // Get todays date and time
  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  distance = endTime - now;

  // Time calculations for days, hours, minutes and seconds
  minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("time-left").innerHTML =  minutes.pad(2) + ":" + seconds.pad(2);

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer-label").innerHTML = "EXPIRED";
  }
}, 1000);
}
function resetTimer() {
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
