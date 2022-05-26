'use strict'

const HINT = '💡'
const LIVE = '💙'

var gLivesLeft
var gHints 
var gIsHinting 
var gSafeClicks

//toggling from each game lvl
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

//rendering hints + changing accordingly
function renderHints(elHint) {
    gIsHinting = true
    gHints--
    var strHTML = ''
    for (var i = 0; i < gHints; i++) {
        strHTML += HINT
    }
    elHint.innerText = strHTML
}

//rendering lives + changing accordingly
function renderLives() {
    var elLives = document.querySelector('.hearts')
    gLivesLeft--
    var strHTML = ''
    for (var i = 0; i < gLivesLeft; i++) {
        strHTML += LIVE
    }
    elLives.innerText = strHTML


}

//after clicking a cell when is hinting true, will expose all cells who are not shown or marked for 1 sec only in the first degree
function showHint(board, idxI, idxJ) {
    for (var i = +idxI - 1; i <= +idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = +idxJ - 1; j <= +idxJ + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            var cell = board[i][j]
            if (cell.isShown) continue
            if (cell.isMarked) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('shown')
            if (cell.minesAroundCount === 0) {
                elCell.innerText = ''
            }
            if (cell.minesAroundCount !== 0) {
                elCell.innerText = cell.minesAroundCount
            }
            if (cell.isMine) elCell.innerText = MINE
        }

    }
}

//hiding showhint function after 1 sec(the timeout is not in this functions but in the cell clicked function )
function hideHint(board, idxI, idxJ) {
    for (var i = +idxI - 1; i <= +idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = +idxJ - 1; j <= +idxJ + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            var cell = board[i][j]
            if (cell.isShown) continue
            if (cell.isMarked) continue
            if (j < 0 || j > board.length - 1) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.remove('shown')
            elCell.innerText = ''
        }
    }
}

//rendering how many mines left
function renderMinesLeft() {
    var elMines = document.querySelector('.minescount')
    if (gTotalMinesLeft < 0) return
    if (gTotalMinesLeft === 0) elMines.innerText = 'You Won!!'
    elMines.innerText = gTotalMinesLeft
}

//changing the safe clickes remaning
function renderSafeClick() {
    var elClickNum = document.querySelector('.remclicks')
    elClickNum.innerText = gSafeClicks
}

//picking a random cell with no mine init and making it pop yellow for 1 sec
function makeSafeClick() {
    if (gSafeClicks === 0) return
    var safeCells = []
    var safeCellsPos = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine === false) {
                safeCells.push(currCell)
                safeCellsPos.push({ i, j })
            }
        }
    }
    var rngNum = getRandomInt(0, safeCellsPos.length)
    var safeCell = safeCells[rngNum]
    var safeCellIJ = safeCellsPos[rngNum]
    if (safeCell.isShown) {
        makeSafeClick()
    } else {
        var elCell = document.querySelector(`.cell-${safeCellIJ.i}-${safeCellIJ.j}`)
        elCell.classList.add('safecell')
        setTimeout(() => {
            elCell.classList.remove('safecell')
        }, 1000);
        gSafeClicks--
        renderSafeClick()
    }
}
