'use strict'
const MINE = '💣'
var gBoard
var gTotalMinesLeft
var gMinesPos
var gClicked
var gTimer
var gStartTime
var isTimerOn

var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function init() {
    gGame.isOn = true
    gBoard = buildBoard()
    gMinesPos = []
    addRandomMine(gLevel.mines)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.game-board')
    gTotalMinesLeft = gLevel.mines
    gClicked = 0
}

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
function renderBoard(board, selector) {
    var strHTML = '<table border="0"><tbody></tbody>'
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = board[i][j]
            var className = 'cell cell-' + i + '-' + j
            if (cell.isMine === false) {
                if (cell.minesAroundCount === 0) {
                    strHTML += '<td onclick="cellClicked(this) ,cellMarked(event)" data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
                } else {
                    strHTML += '<td onclick="cellClicked(this) ,cellMarked(event)" data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
                }
            } else {
                strHTML += '<td onclick="cellClicked(this) ,cellMarked(event)" data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
            }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function countNeighbors(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}


function expandSpace(board, idxI, idxJ) {
    console.log(idxI,idxJ);
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++){
            if (j < 0 || j > board[0].length - 1) continue
            if (i === idxI && j === idxJ) continue
            var cell = board[i][j]
            console.log(i,j);
            cell.isShown = true
            console.log(cell);            
        }
    }

}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cellNegsCount = countNeighbors(gBoard, i, j)
            board[i][j].minesAroundCount = cellNegsCount
        }
    }
}






function addRandomMine(amount) {
    var mines = 0
    while (mines < amount) {
        var pos = {
            i: getRandomInt(0, gBoard.length),
            j: getRandomInt(0, gBoard.length)
        }
        if (gBoard[pos.i][pos.j].isMine === true) continue
        gBoard[pos.i][pos.j].isMine = true
        mines++
        gMinesPos.push(pos)
    }
}
function cellClicked(elCell) {
    if (!gGame.isOn) return
    if (gClicked === 0) timerStart()
    var pos = elCell.dataset
    elCell.classList.add('shown')
    gBoard[pos.i][pos.j].isShown = true
    var cellObj = gBoard[pos.i][pos.j]
    if (cellObj.isMine === true) {
        elCell.innerText = MINE
    } else if (cellObj.minesAroundCount === 0) {
        expandSpace(gBoard,pos.i,pos.j)
        elCell.innerText = ''
    } else {
        elCell.innerText = cellObj.minesAroundCount
    }
    if (elCell.innerText === MINE) {
        gGame.isOn = false
        gameOver(elCell)
    }
    if (checkGameOver()) {
        timerEnd()
        var elBtn = document.querySelector('.btn')
        elBtn.innerText = '😆'
        for (var i = 0; i < gMinesPos.length; i++) {
            var elMine = document.querySelector(`.cell-${gMinesPos[i].i}-${[gMinesPos[i].j]}`)
            elMine.innerText = MINE
            elMine.classList.add('shown')
            var currMine = gBoard[gMinesPos[i].i][gMinesPos[i].j]
            currMine.isShown = true
        }
    }
    gClicked++
}
// function cellMarked(eventMouse) {
//     console.log(eventMouse.code);
// }

function checkGameOver() {
    var cellsCount = gBoard.length ** 2
    var shownCount = 0
    var minesCount = gMinesPos.length
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown === true) shownCount++
        }
    }
    if (cellsCount === shownCount + minesCount) {
        console.log('youwonblyat');
        return true
    }
    return false
}
function gameOver(elCell) {
    timerEnd()
    elCell.classList.add('losingcell')
    for (var i = 0; i < gMinesPos.length; i++) {
        var elMine = document.querySelector(`.cell-${gMinesPos[i].i}-${[gMinesPos[i].j]}`)
        elMine.innerText = MINE
        elMine.classList.add('shown')
        var currMine = gBoard[gMinesPos[i].i][gMinesPos[i].j]
        currMine.isShown = true
    }
    var elBtn = document.querySelector('.btn')
    elBtn.innerText = '🤯'
}
function resetGame() {
    init()
    timerReset()
    var elBtn = document.querySelector('.btn')
    elBtn.innerText = '😀'
}


