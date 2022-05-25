'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}



function timerStart() {
    gStartTime = new Date
    isTimerOn = true
    gTimer = setInterval(timerRun,)
}
function timerRun() {
    if (isTimerOn) {
        var end = new Date
        var time = (end - gStartTime) / 1000
        var elTimer = document.querySelector('.timer')
        elTimer.innerText = time
    }
}
function timerEnd() {
    isTimerOn = false
    clearInterval(gTimer)
}
function timerReset() {
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '00:00'
}