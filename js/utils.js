'use strict'

var gStartTime
var isTimerOn
var gTimer

//random num
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//timer stuff
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
        if (gLevel.size === 4) localStorage.setItem('currScore', time)
        if (gLevel.size === 8) localStorage.setItem('currScore2', time)
        if (gLevel.size === 12) localStorage.setItem('currScore3', time)
    }
}
function timerEnd() {
    isTimerOn = false
    clearInterval(gTimer)
}
function timerReset() {
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '0.00'
}

//building a mat with obj in every cell
function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    return board
}

//rendering the board into the HTML
function renderBoard(board, selector) {
    var cellNum = 1
    var strHTML = '<table  class="table" border="0"><tbody></tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var className = 'cell cell-' + i + '-' + j
            if (cell.isMine === false) {
                if (cell.minesAroundCount === 0) {
                    strHTML += `<td oncontextmenu="cellMarked(this)" onclick="cellClicked(this)" data-i="${i}" data-j="${j}" class="${className} cell${cellNum}"></td>`
                } else {
                    strHTML += `<td oncontextmenu="cellMarked(this)" onclick="cellClicked(this)" data-i="${i}" data-j="${j}" class="${className} cell${cellNum}"></td>`
                }
            } else {
                strHTML += `<td oncontextmenu="cellMarked(this)" onclick="cellClicked(this)" data-i="${i}" data-j="${j}" class="${className} cell${cellNum}"></td>`
            }
            cellNum++
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}