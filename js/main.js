'use strict'

const MINE = '💣'
                                    ///////////////     ////                    ////////////////                ////////
                                        //////          ////                        /////                   ////////////////    
                                        //////          ////                        /////                 //////        //////  
                                        //////          ////                        /////                //////          //////
                                        //////          ////                        /////                 /////  
                                        //////          ////                        /////                  /////     
                                        //////          ////                        /////                   /////    
var gBoard                              //////          ////                         /////                    //////
var gTotalMinesLeft                     //////          ////                          /////          /////       ////
var gMinesPos                           //////          ////                           /////          /////       /////
var gIsClicked                          //////          ////                            /////          /////     //////
var gScore                              //////          ////                            /////           ///////////////          
var gLevel = {                      ///////////////     ///////////////////              /////////////    ///////////
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

//////////////////////////////////////////////
// Send Help!// Too Late Look What I Made😣//
/////////////////////////////////////////////

//will start run once the page is loaded, having most of the global variables set to there values
function init() {
    gLivesLeft = 3
    gHints = 3
    gSafeClicks = 3
    gGame.isOn = true
    gIsClicked = false
    gIsHinting = false
    gBoard = buildBoard()
    gMinesPos = []
    renderBoard(gBoard, '.game-board')
    addRandomMine(gLevel.mines)
    setMinesNegsCount(gBoard)
    gTotalMinesLeft = gLevel.mines
    renderMinesLeft()
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);
}

//counting neighbors for the a specific cell
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
//if cell have 0 beighbors it will expand all cells on the 1st degree
function expandShown(board, idxI, idxJ) {
    for (var i = +idxI - 1; i <= +idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = +idxJ - 1; j <= +idxJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            var cell = board[i][j]
            if (cell.isMarked) continue
            cell.isShown = true
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('shown')
            if (cell.minesAroundCount === 0) {
                elCell.innerText = ''
            }
            if (cell.minesAroundCount !== 0) {
                elCell.innerText = cell.minesAroundCount
            }
        }
    }
}
//filling in every cell the key : minesAroundCount by sending each cell to the count function
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cellNegsCount = countNeighbors(gBoard, i, j)
            board[i][j].minesAroundCount = cellNegsCount
        }
    }
}
//adding random mines based on the level mines
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
//became the biggest function and the one who does almost everything (not sure if it was intended)
//open function to see what is what
function cellClicked(elCell) {
    var elLives = document.querySelector('.hearts')
    var pos = elCell.dataset
    var cellInDom = gBoard[pos.i][pos.j]
    //some checkings if we dont want clicks to happens
    if (cellInDom.isShown) return
    if (cellInDom.isMarked) return
    if (!gGame.isOn) return
    //first click start the timer
    if (!gIsClicked) {
        timerStart()
        gIsClicked = true
        gScore = new Date
    }
    //when clicking a hint we go into this condition that show us the cells and hide them back after 1 sec
    if (gIsHinting) {
        showHint(gBoard, pos.i, pos.j)
        setTimeout(() => {
            hideHint(gBoard, pos.i, pos.j)
        }, 1000);
        gIsHinting = false
        return
    }
    //normal clicks
    elCell.classList.add('shown')
    cellInDom.isShown = true
    if (cellInDom.isMine === true) {
        elCell.innerText = MINE
    } else if (cellInDom.minesAroundCount === 0) {
        expandShown(gBoard, pos.i, pos.j)
        elCell.innerText = ''
    } else {
        elCell.innerText = cellInDom.minesAroundCount
    }
    //clicking a mine:  updating the hearts count updating the mines count and if no more hearts game over
    if (elCell.innerText === MINE) {
        gTotalMinesLeft--
        renderMinesLeft()
        renderLives()
        if (gLivesLeft === 0) {
            renderLives()
            gGame.isOn = false
            gameOver(elCell)
            elLives.innerText = 'You Are Dead!'
        }
        //function that pop a modal to let u know we clicked a mine
        alertMine()
    }
    //checking if we won the game and rendering the smile into crown as a king of the game
    if (checkGameOver()) {
        timerEnd()
        var endScore = new Date
        var elBtn = document.querySelector('.btn')
        elBtn.innerText = '👑'
        exposeMines()
        gScore = ((parseInt(endScore - gScore) / 10) / 100)
    }
}
//when cell is right clicked it wil lbe marked with a flag
function cellMarked(elCell) {
    var pos = elCell.dataset
    var cell = gBoard[pos.i][pos.j]
    if (cell.isShown) return
    if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerText = ''
        gTotalMinesLeft++
        renderMinesLeft()
    } else {
        cell.isMarked = true
        elCell.innerText = '🚩'
        gTotalMinesLeft--
        renderMinesLeft()
        if (checkGameOver()) {
            var endScore = new Date
            timerEnd()
            var elBtn = document.querySelector('.btn')
            elBtn.innerText = '👑'
            exposeMines()
            gScore = ((parseInt(endScore - gScore) / 10) / 100)
        }
    }
}
//checking of game is over by winning
function checkGameOver() {
    var cellsCount = gBoard.length ** 2
    var shownCount = 0
    var markCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown === true) shownCount++
            if (gBoard[i][j].isMarked === true) markCount++
        }
    }
    if (shownCount === cellsCount - markCount && shownCount > 0 && markCount <= gMinesPos.length) {
        return true
    }
    return false
}
//when game is over by clicking a mine the mine background wil become red as its the losing mine and all mines will be revealed
function gameOver(elCell) {
    timerEnd()
    elCell.classList.add('losingcell')
    exposeMines()
    var elBtn = document.querySelector('.btn')
    elBtn.innerText = '🤯'
}
//reseting the game
function resetGame() {
    init()
    timerEnd()
    timerReset()
    gIsClicked = false
    renderSafeClick()
    var elBtn = document.querySelector('.btn')
    var elhearts = document.querySelector('.hearts')
    var elHints = document.querySelector('.hints')
    elBtn.innerText = '😀'
    elhearts.innerText = '💙💙💙'
    elHints.innerText = '💡💡💡'
}

//when clicking a mine a modal will pop up to let you know!!!! be careful!!
function alertMine() {
    var elAlert = document.querySelector('.mineclick')
    elAlert.style.display = 'block'
    setTimeout(() => {
        elAlert.style.display = 'none'
    }, 1000);
}
//incharge for exposing the mines in gameover function and some other case when game is over
function exposeMines() {
    for (var i = 0; i < gMinesPos.length; i++) {
        var elMine = document.querySelector(`.cell-${gMinesPos[i].i}-${[gMinesPos[i].j]}`)
        elMine.innerText = MINE
        elMine.classList.add('shown')
        var currMine = gBoard[gMinesPos[i].i][gMinesPos[i].j]
        currMine.isShown = true
    }
}


// WIP
//storing the best score each round and checking if its 
//better then the current best score

// function bestScoreRender() {
//     var elScore = document.querySelector('.bscore')
//     var bestScore1 = localStorage.getItem('score1')
//     var bestScore2 = localStorage.getItem('score2')
//     var bestScore3 = localStorage.getItem('score3')
//     if (gLevel.size === 4) {
//         if (elScore.innerText === '0.00') elScore.innerText = gScore
//         if (gScore < bestScore1) {
//             localStorage.setItem('score1', gScore)
//             elScore.innerText = gScore
//         }
//     }
//     if (gLevel.size === 8) {
//         if (elScore.innerText === '0.00') elScore.innerText = gScore
//         if (gScore < bestScore2) {
//             localStorage.setItem('score2', gScore)
//             elScore.innerText = gScore
//         }
//     }
//     if (gLevel.size === 12) {
//         if (elScore.innerText === '0.00') elScore.innerText = gScore
//         if (gScore < bestScore3) {
//             localStorage.setItem('score3', gScore)
//             elScore.innerText = gScore
//         }
//     }
// }
// rendering the dom with past best scores when game starts
// function renderPastScores() {
//     var elScore = document.querySelector('.bscore')
//     var scoreLvl1 = localStorage.getItem('Best Score1:')
//     var scoreLvl2 = localStorage.getItem('Best Score2:')
//     var scoreLvl3 = localStorage.getItem('Best Score3:')
//     if (gLevel.size === 4) {
//         if (!elScore.innerText) elScore.innerText = '0.00'
//         elScore.innerText = scoreLvl1
//     } else if (gLevel.size === 8) {
//         if (!elScore.innerText) elScore.innerText = '0.00'
//         elScore.innerText = scoreLvl2
//     } else if (gLevel.size === 12) {
//         if (!elScore.innerText) elScore.innerText = '0.00'
//         elScore.innerText = scoreLvl3

//     }
// }
