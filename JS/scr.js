/*
*  Game implementation
*/
class Game {
    constructor(playerX, playerO) {
        this.emptyCell_ImgSrc = "img/cell.png";

        this.player1 = playerX;
        this.player2 = playerO;
        this.drawBoard([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], this.player2, this.player1)
    }

    // Remove board 
    clearBoard() {
        var board = document.getElementById("boardContainer");
        while (board.hasChildNodes()) {
            board.removeChild(board.childNodes[0]);
        }
    }

    // Draw board
    drawBoard(curState, curPlayer, nextPlayer) {
        this.clearBoard();
        // Redraw board
        let board = document.getElementById("boardContainer");
        let j = -1;
        for (let i = 0; i < curState.length; ++i) {
            if (i % 3 == 0) j++;
            let img = new Image();
            
            // Draw cells
            if (curState[i] == this.player1.symbol) {
                img.src = this.player1.symbol_ImgSrc;
            } else if (curState[i] == this.player2.symbol) {
                img.src = this.player2.symbol_ImgSrc;
            } else {
                // Empty cell with onclick event
                img.src = this.emptyCell_ImgSrc;
                if (curPlayer != undefined && nextPlayer != undefined)
                    img.onclick = () => { this.makeMove(i, curState, nextPlayer, curPlayer);};
            }

            img.width = board.clientWidth / 3;
            img.height = board.clientHeight / 3;
            img.style.left = img.width * j + 'px';
            img.style.top = img.height * i % 3 + 'px';
            board.appendChild(img);
        }

        // Perform move if nextPlayer is Autoplayer
        if (nextPlayer instanceof GameBot) {
            let botState = nextPlayer.botMove(curState);
            this.makeMove(botState, curState, nextPlayer, curPlayer);

            // Redraw tree if active
            if(document.getElementById("showTreeBtn").classList.contains("active")){
                    document.getElementById("treeBody").classList.remove("displayNone");
            }
        }
    }

    //
    // Check if there is a winner 
    //
    winnerExists(state) {
        // Define all possible lines
        let lines = [[state[0], state[1], state[2]], [state[3], state[4], state[5]], [state[6], state[7], state[8]], //rows
        [state[0], state[3], state[6]], [state[1], state[4], state[7]], [state[2], state[5], state[8]], //columns
        [state[0], state[4], state[8]], [state[2], state[4], state[6]]];                                //diagonals

        // Check if there are more then three symbols in a line
        let result = [false];
        lines.forEach((line) => {
            let symbolsCountP1 = line.filter(item => item == this.player1.symbol).length;
            let symbolsCountP2 = line.filter(item => item == this.player2.symbol).length;
            if (symbolsCountP1 > 2) {
                result = [true, this.player1];
            }
            if (symbolsCountP2 > 2) {
                result = [true, this.player2];
            }
        });
        return result;
    };

   
    freeSpaceExists(curState) {

        // If there is a winer end the game 
        let getWinner = this.winnerExists(curState);
        if (getWinner[0]) {

            if (getWinner[1] == this.player1) {
                document.getElementById("status").innerHTML = "End of Game. Player 1 won!";
                winsP1++;
                updateScores();
            } else if (getWinner[1] == this.player2) {
                document.getElementById("status").innerHTML = "End of Game. Player 2 won!";
                winsP2++;
                updateScores();
            }
            return false;

        }
        // If there are no empty cell end the game with tie
        if (curState.every((element) => {
            return (element == this.player1.symbol || element == this.player2.symbol);
        })) {
            document.getElementById("status").innerHTML = "End of Game. Dead heat!";
            ties++;
            console.log('End of Game');
            updateScores();
            return false;
        }
        // Continue the gane
        return true;
    }

    //
    // Perform move
    //
    makeMove(position, curState, curPlayer, nextPlayer) {
        if (curState[position] != this.player1.symbol && curState[position] != this.player2.symbol) {
            curState[position] = curPlayer.symbol;
            this.freeSpaceExists(curState) ? this.drawBoard(curState, curPlayer, nextPlayer) : this.drawBoard(curState);
        }
    }

}


/*
*  Game Inicilization
*/
let winsP1 = 0, winsP2 = 0, ties = 0;
let symbX = '×', symbO = '○';

//
// Update the information about players' scores
//
function updateScores() {
    document.getElementById("scores").innerHTML = "Player 1: " + winsP1 + "   Ties: " + ties + "   Player 2: " + winsP2;

}

//
// Start new game if the symbol was changed
//
function updateSymbols() {
    if (document.getElementById("symbolP1").textContent == symbX) {
        document.getElementById("symbolP1").classList.remove("figure-X");
        document.getElementById("symbolP1").classList.add("figure-O");
        document.getElementById("symbolP1").innerHTML = symbO;
    }
    else {
        document.getElementById("symbolP1").classList.remove("figure-O");
        document.getElementById("symbolP1").classList.add("figure-X");
        document.getElementById("symbolP1").innerHTML = symbX;

    }
    startNewGame();

    // Swap players: Player 1 is the player who always go first
    let tmp = winsP1;
    winsP1 = winsP2;
    winsP2 = tmp;
    updateScores();
}

//
// Start new game 
//
function startNewGame() {
    // Clean tree
    removeTree();

    document.getElementById("status").innerHTML = "";
    // Get depth from game complexity
    var depth = $("select#depth").children("option:selected").val();

    // Set the symbol for each player
    let playerX, playerO;
    if (document.getElementById("symbolP1").textContent == symbX) {
        playerX = new Player(symbX, "img/x.png");
        playerO = new GameBot(symbO, "img/o.png", symbX, depth);
    }
    else{
        playerO = new Player(symbO, "img/o.png");
        playerX = new GameBot(symbX, "img/x.png", symbO, depth);
    }

    // Start new game
    let game = new Game(playerX, playerO);//, depth);
}

//
// Initialization
//
window.onload = () => {
    document.getElementById("symbolP1").addEventListener("click", updateSymbols);
    document.getElementById("gameBtn").addEventListener("click", startNewGame);
    document.getElementById("gameBtn").click();

    // Tree State initialization
    document.getElementById("showTreeBtn").addEventListener("click", () => {
        document.getElementById("showTreeBtn").classList.toggle("active");
        document.getElementById("treeBody").classList.toggle("displayNone");
        document.getElementById("showTreeBtn").blur();
    });

    // Scores initialization
    winsP1 = 0;
    winsP2 = 0;
    ties = 0;
    updateScores();
};

