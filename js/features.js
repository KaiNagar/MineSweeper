'use strict'

const HINT = '💡'
const LIVE = '💙'

var gLivesLeft
var gHints
var gIsHinting
var gSafeClicks
var gElScore = document.querySelector('.bscore')
var gMoves = []
var isManual = false




//toggling from each game lvl
function toggleGame(elBtn) {
    timerEnd()
    timerReset()
    if (elBtn.innerText === 'Beginner') {
        isManual = false
        gLevel.size = 4
        gLevel.mines = 2
        gElScore.innerText = localStorage.getItem('bestScore')
    }
    if (elBtn.innerText === 'Medium') {
        isManual = false
        gLevel.size = 8
        gLevel.mines = 12
        gElScore.innerText = localStorage.getItem('bestScore2')

    }
    if (elBtn.innerText === 'Expert') {
        isManual = false
        gLevel.size = 12
        gLevel.mines = 30
        gElScore.innerText = localStorage.getItem('bestScore3')
    }
    if (elBtn.innerText === '7 BOOM!') {
        isManual = false
        boom(gBoard, gMinesPos)
        return

    }
    if (elBtn.innerText === 'Setting Manually') {
        isManual = true
        gMinesPos = []
        return
    }
    resetGame()
}

//rendering hints + changing accordingly
function changingHintsEffect(elSpan) {
    gIsHinting = true
    var elModalHint = document.querySelector('.hintmodal')
    elModalHint.style.display = 'block'
    elSpan.classList.add('hintting')
    elSpan.classList.remove('hintting')
    elSpan.innerText = ''
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
    gIsHinting = false
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

// rendering the best scores on this curr web , per level
function renderBestScore() {
    if (gLevel.size === 4 && gIsClicked) {
        var currScore = localStorage.getItem('currScore')
        var bestScore = localStorage.getItem('bestScore')
        if (!bestScore) {
            localStorage.setItem('bestScore', currScore)
            gElScore.innerText = '0.00'
            bestScore = localStorage.getItem('bestScore')
        }
        if (+currScore < +bestScore) {
            localStorage.setItem('bestScore', currScore)
        }
        gElScore.innerText = localStorage.getItem('bestScore')
    }
    if (gLevel.size === 8 && gIsClicked) {
        var currScore2 = localStorage.getItem('currScore2')
        var bestScore2 = localStorage.getItem('bestScore2')
        
        if (!bestScore2) {
            localStorage.setItem('bestScore2', currScore2)
            gElScore.innerText = '0.00'
            bestScore2 = localStorage.getItem('bestScore2')
        }
        if (+currScore2 < +bestScore2) {
            localStorage.setItem('bestScore2', currScore2)
        }
        gElScore.innerText = localStorage.getItem('bestScore2')
    }
    if (gLevel.size === 12 && gIsClicked) {
        var currScore3 = localStorage.getItem('currScore3')
        var bestScore3 = localStorage.getItem('bestScore3')
        if (!bestScore3) {
            localStorage.setItem('bestScore3', currScore3)
            gElScore.innerText = '0.00'
            bestScore3 = localStorage.getItem('bestScore3')
        }
        if (+currScore3 < +bestScore3) {
            localStorage.setItem('bestScore3', currScore3)
        }
        gElScore.innerText = localStorage.getItem('bestScore3')
    }

}

//clearing the board from mines and then setting mines on every 7th cell
function boom(board, minesPos) {
    var minesPos = []
    clearBoard()
    for (var cellNum = 7; cellNum < (board.length * board.length); cellNum += 7) {
        var elCell = document.querySelector(`.cell${cellNum}`)
        var pos = elCell.dataset
        gBoard[pos.i][pos.j].isMine = true
        minesPos.push(pos)
    }
    setMinesNegsCount(gBoard)
    gMinesPos = minesPos
}

//clearing the board from mines
function clearBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            gBoard[i][j].isMine = false
        }
    }
}
// after placing the mines manually this function clearing the inner text of te board and setting the board mines around count for the user to play 
// this function start when pressing the button ready to play which pops up only after placing all the mines needed
function playManual(elBtn) {
    isManual = false
    for (var i = 0; i < gMinesPos.length; i++) {
        var elCellMine = document.querySelector(`.cell-${gMinesPos[i].i}-${gMinesPos[i].j}`)
        elCellMine.innerText = ''
        gBoard[gMinesPos[i].i][gMinesPos[i].j].isMine = true
    }
    setMinesNegsCount(gBoard)
}

//reseting local storage and reseting best scores
// function clearLocal(){
//     localStorage.clear()
//     renderBestScore()
// }