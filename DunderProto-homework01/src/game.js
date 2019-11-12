// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync
const connectmoji = require('./connectmoji.js');
const readlineSync = require('readline-sync');
const clear = require('clear');
const wcwidth = require('wcwidth');

readlineSync.question("Press <ENTER> to start game");
if (process.argv.length <= 2) {
    const setUp = readlineSync.question('Enter the number of rows, columns, and consecutive "pieces" for win (all separated by commas... for example: 6,7,4) ');
    console.log("Using row, col and consecutive: " + setUp);

    const players = readlineSync.question('Enter two characters that represent the player and computer (separated by a comma... for example: P, C) ');
    console.log("Using default player and computer characters: " + players);

    let b = connectmoji.generateBoard(setUp.split(',')[0], setUp.split(',')[1]);

    const first = readlineSync.question('Who goes first, (P)layer or (C)omputer? ');
    if (first === "P") {
        console.log("Player goes first");
        while (true) {
            console.log(connectmoji.boardToString(b));
            let userMove = readlineSync.question("Choose a column letter to drop your piece in: ");
            if (connectmoji.getAvailableColumns(b).includes(userMove) === false) {
                console.log("Invalid move!");
                continue;
            } else {
                let cellToFill = connectmoji.letterToCol(userMove);
                let rowMove = connectmoji.getEmptyRowCol(b, userMove).row;
                let colMove = connectmoji.getEmptyRowCol(b, userMove).col;
                b = connectmoji.setCell(b, rowMove, colMove, players.split(',')[0]);
                if (connectmoji.hasConsecutiveValues(b, rowMove, colMove, parseInt(setUp.split(',')[2]))) {
                    console.log("Player wins!");
                    console.log(connectmoji.boardToString(b));
                    break;
                }
                if (connectmoji.getAvailableColumns(b).length === 0) {
                    console.log("Tie. Board is full with no winner.");
                    break;
                }

                let random = Math.floor(Math.random()*(connectmoji.getAvailableColumns(b).length));
                let computerMove = connectmoji.getAvailableColumns(b)[random];
                let rowMove2 = connectmoji.getEmptyRowCol(b, computerMove).row;
                let colMove2 = connectmoji.getEmptyRowCol(b, computerMove).col;
                b = connectmoji.setCell(b, rowMove2, colMove2, players.split(',')[1]);
                if (connectmoji.hasConsecutiveValues(b, rowMove2, colMove2, parseInt(setUp.split(',')[2]))) {
                    console.log("Computer wins!");
                    break;
                }
            }
        }
    } else if (first === "C") {
        console.log("Computer goes first");
        while (true) {
            let random = Math.floor(Math.random()*(connectmoji.getAvailableColumns(b).length));
            let computerMove = connectmoji.getAvailableColumns(b)[random];
            let rowMove2 = connectmoji.getEmptyRowCol(b, computerMove).row;
            let colMove2 = connectmoji.getEmptyRowCol(b, computerMove).col;
            b = connectmoji.setCell(b, rowMove2, colMove2, players.split(',')[1]);
            console.log(connectmoji.boardToString(b));
            if (connectmoji.hasConsecutiveValues(b, rowMove2, colMove2, parseInt(setUp.split(',')[2]))) {
                console.log(connectmoji.boardToString(b));
                console.log("Computer wins!");
                break;
            }
            let userMove = readlineSync.question("Choose a column letter to drop your piece in: ");
            if (connectmoji.getAvailableColumns(b).includes(userMove) === false) {
                console.log("Invalid move!");
                continue;
            } else {
                let cellToFill = connectmoji.letterToCol(userMove);
                let rowMove = connectmoji.getEmptyRowCol(b, userMove).row;
                let colMove = connectmoji.getEmptyRowCol(b, userMove).col;
                b = connectmoji.setCell(b, rowMove, colMove, players.split(',')[0]);
                if (connectmoji.hasConsecutiveValues(b, rowMove, colMove, parseInt(setUp.split(',')[2]))) {
                    console.log("Player wins!");
                    console.log(connectmoji.boardToString(b));
                    break;
                }
                if (connectmoji.getAvailableColumns(b).length === 0) {
                    console.log("Tie. Board is full with no winner.");
                    break;
                }
            }
        }
    }
} else {
    // X,XOAABBCCDD,4,4,3
    const scripted = process.argv[2].split(',');
    let gameOn = true;
    const PLAYER_VALUE = [...scripted[0]];
    const MOVE_STRING = [...scripted[1]];
    let currentPlayer;

    const NUMBER_ROWS = parseInt(scripted[2]);
    const NUMBER_COLUMNS = parseInt(scripted[3]);
    const NUMBER_CONSECUTIVE = parseInt(scripted[4]);
    const board = connectmoji.generateBoard(NUMBER_ROWS, NUMBER_COLUMNS);
    const updatedBoard = connectmoji.autoplay(board, MOVE_STRING, NUMBER_CONSECUTIVE);
    let b = updatedBoard.board;

    if (MOVE_STRING.length % 2 === 0) {
        currentPlayer = MOVE_STRING[0];
    } else {
        currentPlayer = MOVE_STRING[1];
    }

    console.log(connectmoji.boardToString(b));

    if (updatedBoard.winner === null) {
        while (gameOn) {
            if (currentPlayer === MOVE_STRING[0]) {
                let userMove = readlineSync.question("Choose a column letter to drop your piece in: ");

                if (connectmoji.getAvailableColumns(b).includes(userMove) === false) {
                    console.log("Invalid move!");
                    continue;
                } else {
                    let cellToFill = connectmoji.letterToCol(userMove);
                    let rowMove = connectmoji.getEmptyRowCol(b, userMove).row;
                    let colMove = connectmoji.getEmptyRowCol(b, userMove).col;
                    b = connectmoji.setCell(b, rowMove, colMove, PLAYER_VALUE[0]);
                    if (connectmoji.hasConsecutiveValues(b, rowMove, colMove, NUMBER_CONSECUTIVE)) {
                        console.log("Player wins!");
                        console.log(connectmoji.boardToString(b));
                        break;
                    }
                    console.log(connectmoji.boardToString(b));
                    
                    
                    if (connectmoji.getAvailableColumns(b).length === 0) {
                        console.log("Tie. Board is full with no winner.");
                        break;
                    }
                    
                    let random = Math.floor(Math.random()*(connectmoji.getAvailableColumns(b).length));
                    let computerMove = connectmoji.getAvailableColumns(b)[random];
                    let rowMove2 = connectmoji.getEmptyRowCol(b, computerMove).row;
                    let colMove2 = connectmoji.getEmptyRowCol(b, computerMove).col;
                    b = connectmoji.setCell(b, rowMove2, colMove2, MOVE_STRING[1]);
                    console.log(connectmoji.boardToString(b));
                    if (connectmoji.hasConsecutiveValues(b, rowMove2, colMove2, NUMBER_CONSECUTIVE)) {
                        console.log("Computer wins!");
                        break;
                    }
                }
            } else if (currentPlayer === MOVE_STRING[1]) {
                let userMove = readlineSync.question("Choose a column letter to drop your piece in: ");
                if (connectmoji.getAvailableColumns(b).includes(userMove) === false) {
                    console.log("Invalid move!");
                    continue;
                } else {
                    let random = Math.floor(Math.random()*(connectmoji.getAvailableColumns(b).length));
                    let computerMove = connectmoji.getAvailableColumns(b)[random];
                    let rowMove2 = connectmoji.getEmptyRowCol(b, computerMove).row;
                    let colMove2 = connectmoji.getEmptyRowCol(b, computerMove).col;
                    b = connectmoji.setCell(b, rowMove2, colMove2, MOVE_STRING[1]);
                    console.log(connectmoji.boardToString(b));
                    if (connectmoji.hasConsecutiveValues(b, rowMove2, colMove2, NUMBER_CONSECUTIVE)) {
                        console.log("Computer wins!");
                        break;
                    } else if (connectmoji.getAvailableColumns(b).length === 0) {
                        console.log("Tie. Board is full with no winner.");
                        break;
                    }

                    let cellToFill = connectmoji.letterToCol(userMove);
                    let rowMove = connectmoji.getEmptyRowCol(b, userMove).row;
                    let colMove = connectmoji.getEmptyRowCol(b, userMove).col;
                    b = connectmoji.setCell(b, rowMove, colMove, PLAYER_VALUE[0]);
                    if (connectmoji.hasConsecutiveValues(b, rowMove, colMove, NUMBER_CONSECUTIVE)) {
                        console.log("Player wins!");
                        console.log(connectmoji.boardToString(b));
                        break;
                    }
                    console.log(connectmoji.boardToString(b));
                    
                    
                    if (connectmoji.getAvailableColumns(b).length === 0) {
                        console.log("Tie. Board is full with no winner.");
                        break;
                    }
                }
                
            } 
        }
    } else {
        if (currentPlayer === MOVE_STRING[1]) {
            console.log("Player wins!");
        } else if (currentPlayer === MOVE_STRING[0]) {
            console.log("Computer wins!");
        }
        
    }

}



// if (updatedBoard.winner === null) {
//     while (gameOn) {
//         if (currentPlayer === MOVE_STRING[0]) {
//             let userMove = readlineSync.question("Choose a column letter to drop your piece in: ");
//             console.log(connectmoji.getAvailableColumns(updatedBoard));
//             if (connectmoji.getAvailableColumns(updatedBoard).includes(userMove)) {
//                 console.log("oh");
//             }
//             let cellToFill = connectmoji.letterToCol(userMove);
//             let rowMove = connectmoji.getEmptyRowCol(updatedBoard.board, userMove).row;
//             let colMove = connectmoji.getEmptyRowCol(updatedBoard.board, userMove).col;
//             console.log(rowMove);
//             console.log(colMove);
//             updatedBoard = connectmoji.setCell(updatedBoard.board, rowMove, colMove, PLAYER_VALUE);
//             console.log(connectmoji.boardToString(updatedBoard));
//             if (connectmoji.hasConsecutiveValues(updatedBoard, rowMove, colMove, NUMBER_CONSECUTIVE)) {
//                 console.log(PLAYER_VALUE + " wins");
//                 gameOn = false;
//             }

//             currentPlayer = MOVE_STRING[1];
//         }
        
//     }
// }