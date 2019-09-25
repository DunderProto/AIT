// implement your functions here
// ...don't forget to export functions!
const wcwidth = require('wcwidth');

const generateBoard = (rows, cols, fill = null) => {
    const values = [];
    for (let i = 1; i <= rows * cols; i++) {
        values.push(fill);
    }
    return {
        data: values,
        rows: rows,
        cols: cols
    }
}

const rowColToIndex = (board, row, col) => {
    return board.cols*row + col;
}

const indexToRowCol = (board, i) => {
    let col = i % board.cols;
    let row = Math.floor(i/board.cols);
    return { row: row, col: col }
}

const setCell = (board, row, col, value) => {
    let copy = board.data.slice();
    let replace = rowColToIndex(board, row, col);
    copy[replace] = value;
    return { 
        data: copy, 
        rows: board.rows,
        cols: board.cols
    };
} // why does copy return NaN? (for example, if you try to console.log(rowColToIndex(copy, row, col))
  //) instead of console.log(rowColToIndex(board, row, col))

function setCells(board, ...args) {
    let copy = board.data.slice();
    for (let i = 1; i < arguments.length; i++) {
        let replace = rowColToIndex(board, arguments[i].row, arguments[i].col);
        copy[replace] = arguments[i].val;
    }
    return { 
        data: copy, 
        rows: board.rows,
        cols: board.cols
    };
} // why do we need to use regular function instead of arrow functions to loop through function parameters?

const boardToString = (board) => {
    let fullBoard = "";
    let header = "";
    let boarder = "";
    for (let i = 0; i < board.rows; i++) {
        for (let j = 0; j < board.cols; j++) {
            if (board.data[board.cols*i + j] != null) {
                if (wcwidth(board.data[board.cols*i + j]) === 2) {
                    fullBoard += " | " + board.data[board.cols*i + j];
                    if (j === board.cols - 1) {
                        fullBoard += " |";
                    }
                    continue;
                } else if (wcwidth(board.data[board.cols*i + j] === 1)) {
                    fullBoard += " | " + board.data[board.cols*i + j][0] + "  ";
                    if (j === board.cols - 1) {
                        fullBoard += " |";
                    }
                }
                fullBoard += " | " + board.data[board.cols*i + j] + " ";
            } 
            else if (board.data[board.cols*i + j] === null || board.data[board.cols*i + j] === undefined) {
                fullBoard += " | " + "  ";
            }

            if (j === board.cols - 1) {
                fullBoard += " |";
            }
        }
        fullBoard += "\n";
    }

    fullBoard += " |"

    for (let i = 0; i < board.cols; i++) {
        if (i === board.cols - 1) {
            boarder += "----|";
            break;
        }
        boarder += "----+";
        
    }
    fullBoard += boarder + "\n";

    for (let i = 0; i < board.cols; i++) {
        header += "| " + String.fromCodePoint(65 + i) + "  ";
        if (i === board.cols - 1) {
            header += "|";
        }
    }
    fullBoard += " " + header + "\n";

    return fullBoard;   
}

const letterToCol = (letter) => {
    if (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) < 91 && letter.length === 1) {
        return letter.charCodeAt(0) - 65;
    } else {
        return null;
    }
}

const getEmptyRowCol = (board, letter, empty = null) => {
    let colNum = letterToCol(letter);
    if (colNum === empty) {
        return empty;
    }
    for (let i = board.rows - 1; i >= 0; i--) {
        if (board.data[rowColToIndex(board, i, colNum)] === empty) {
            // for (let j = i - 2; j >= 0; j--) {
            //     if (board.data[rowColToIndex(board, j, colNum)] != empty) {
            //         return empty;
            //     }
            // }
            if (i === 0 && board.data[rowColToIndex(board, i, colNum)] !== empty) {
                return empty;
            }
            return {row: i, col: colNum};
        }
    }
    return empty;
}

const getAvailableColumns = (board) => {
    let letters = [];
    for (let i = 0; i < board.cols; i++) {
        if (getEmptyRowCol(board, String.fromCodePoint(65 + i)) !== null) {
            letters.push(String.fromCodePoint(65 + i));
        }
    }
    return letters;
}

// const isFullColumn = (board, col) => {
//     for (let i = board.rows - 1; i >= 0; i--) {
//         if 
//     }
// }

const checkWinner = (array, n) => {
    let value = " ";
    let count = 1;
    for (let i = 0; i < array.length; i++) {
        if (count >= n) {
            break;
        }
        else if (array[i] !== array[i - 1] || array[i] === undefined || array[i] === null) {
            value = array[i];
            count = 1;
        } else {
            count++;
        }
    }
    return count === n;
}

const hasConsecutiveValues = (board, row, col, n) => {
    let diagonalDown = [];
    let diagonalUp = [];
    let horizontal = [];
    let vertical = [];
    for (let i = 0; i < board.rows; i++) {
        for (let j = 0; j < board.cols; j++) {
            if (i === row) {
                horizontal.push(board.data[rowColToIndex(board, i, j)]);
            }
            if (j === col) {
                vertical.push(board.data[rowColToIndex(board, i, j)]);
            }
            if (i - j === row - col) {
                diagonalDown.push(board.data[rowColToIndex(board, i, j)]);
            }
            if (i + j === row + col) {
                diagonalUp.push(board.data[rowColToIndex(board, i, j)]);
            }
        }
    }
    return checkWinner(diagonalDown, n) || checkWinner(diagonalUp, n) || checkWinner(horizontal, n) || checkWinner(vertical, n)
}

const autoplay = (board, s, numConsecutive) => {
    let updatedBoard = board;
    let stringArray = [...s];
    let player1 = stringArray[0];
    let player2 = stringArray[1];
    let lastPieceMoved = player1;
    let moves = stringArray.slice(2);
    let numMoves = 1;
    let error = {};
    for (let i = 0; i < moves.length; i++) {
        let rowMove = getEmptyRowCol(updatedBoard, moves[i]).row;
        let colMove = getEmptyRowCol(updatedBoard, moves[i]).col;
        updatedBoard = setCell(updatedBoard, rowMove, colMove, lastPieceMoved);
        if (hasConsecutiveValues(updatedBoard, rowMove, colMove, numConsecutive)) {
            return {
                board: updatedBoard,
                lastPieceMoved: lastPieceMoved,
                winner: lastPieceMoved
            }
        }
        if (lastPieceMoved === player1) {
            lastPieceMoved = player2;
        } else {
            lastPieceMoved = player1;
        }
        numMoves++;
    }
    return {
        board: updatedBoard,
        lastPieceMoved: lastPieceMoved,
        error: error,
        winner: null
    };
}

module.exports = {
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex,
    indexToRowCol: indexToRowCol,
    setCell: setCell,
    setCells: setCells,
    boardToString: boardToString,
    letterToCol: letterToCol,
    getEmptyRowCol: getEmptyRowCol,
    getAvailableColumns: getAvailableColumns,
    hasConsecutiveValues: hasConsecutiveValues,
    checkWinner: checkWinner,
    autoplay: autoplay
}