'use strict'
const MINE = '💣'
var gBoard
var gTotalMinesLeft
var gMinesPos
var gIsClicked
var gTimer
var gStartTime
var isTimerOn
var gElTable
var gLivesLeft
var isRightClick
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

////////////////////////////////////////
// Send Help!// 
////////////////////////////////////////


function init() {
    gLivesLeft = 3
    gGame.isOn = true
    gIsClicked = false
    gBoard = buildBoard()
    gMinesPos = []
    addRandomMine(gLevel.mines)
    renderBoard(gBoard, '.game-board')
    gTotalMinesLeft = gLevel.mines
    gElTable = document.querySelector('.table')
    gElTable.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
    }, false);
    window.addEventListener('contextmenu', (event) => {
        isRightClick = event.button

    })



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
    var strHTML = '<table class="table" border="0"><tbody></tbody>'
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = board[i][j]
            var className = 'cell cell-' + i + '-' + j
            if (cell.isMine === false) {
                if (cell.minesAroundCount === 0) {
                    strHTML += '<td onclick="cellClicked(this) ,oncontextmenu="cellMarked(this)"" data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
                } else {
                    strHTML += '<td onclick="cellClicked(this),oncontextmenu="cellMarked(this)" data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
                }
            } else {
                strHTML += '<td onclick="cellClicked(this),oncontextmenu="cellMarked(this)" data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
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


function expandShown(board, idxI, idxJ) {
    for (var i = +idxI - 1; i <= +idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = +idxJ - 1; j <= +idxJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === +idxI && j === +idxJ) continue
            var cell = board[i][j]
            cell.isShown = true
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('shown')
            if (cell.minesAroundCount === 0) {
                // expandShown(gBoard, i, j)
            }
            if (cell.minesAroundCount !== 0) {
                elCell.innerText = cell.minesAroundCount
            }
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

function cellClicked(elCell,) {
    if (isRightClick === 2) cellMarked(elCell)
    elCell.addEventListener('contextmenu', cellMarked(elCell))
    var elLives = document.querySelector('.lives')
    var elAlert = document.querySelector('.mineclick')
    var pos = elCell.dataset
    if (!gIsClicked) {
        timerStart()
        gIsClicked = true
        setMinesNegsCount(gBoard)
    }
    if (!gGame.isOn) return
    elCell.classList.add('shown')
    gBoard[pos.i][pos.j].isShown = true
    var cellObj = gBoard[pos.i][pos.j]
    if (cellObj.isMine === true) {
        elCell.innerText = MINE
    } else if (cellObj.minesAroundCount === 0) {
        expandShown(gBoard, pos.i, pos.j)
        elCell.innerText = ''
    } else {
        elCell.innerText = cellObj.minesAroundCount
    }
    if (elCell.innerText === MINE) {
        if (!elCell.isShown && gLivesLeft === 3) {
            elLives.innerText = 'Lives Left:💙💙'
            gLivesLeft--
        } else if (!elCell.isShown && gLivesLeft === 2) {
            elLives.innerText = 'Lives Left:💙'
            gLivesLeft--
        } else {
            elLives.innerText = 'Lives Left:You Are Dead'
            gGame.isOn = false
            gameOver(elCell)
        }
        elAlert.style.display = 'block'
        setTimeout(() => {
            elAlert.style.display = 'none'
        }, 1000);

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
    gIsClicked++
}

function cellMarked(elCell) {
    console.log(elCell);
    if (elCell.isShown) return
    if (elCell.isMarked) {
        elCell.isMarked = false
        elCell.classList.remove('marked')
    } else {
        elCell.isMarked = true
        elCell.classList.add('marked')
    }
}

function checkGameOver() {
    var cellsCount = gBoard.length ** 2
    var shownCount = 0
    var minesCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown === true) shownCount++
            if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                minesCount++
            }
        }
    }
    if (cellsCount === shownCount + minesCount) {
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
    timerEnd()
    timerReset()
    gIsClicked = false
    var elBtn = document.querySelector('.btn')
    var elLives = document.querySelector('.lives')
    elBtn.innerText = '😀'
    elLives.innerText = 'Lives Left:💙💙💙'
}

function toggleGame(elBtn) {
    timerEnd()
    timerReset()
    if (elBtn.innerText === 'Beginner') {
        gLevel.size = 4
        gLevel.mines = 2
    }
    if (elBtn.innerText === 'Medium') {
        gLevel.size = 8
        gLevel.mines = 12
    }
    if (elBtn.innerText === 'Expert') {
        gLevel.size = 12
        gLevel.mines = 30
    }
    // if(elBtn.innerText === 'Custom'){
    //     gLevel.size = 4
    //     gLevel.mines = 2
    // }
    resetGame()
}
