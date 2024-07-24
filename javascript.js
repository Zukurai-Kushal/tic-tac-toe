const Game = (function(){

})();

const Gameboard = (function(){
    const board = [];
    let movesRemaining = 9;
    let currPlayer = 1;

    const printToConsole = ()=>{
        for(let i=0; i<3; i++){
            console.log(board[i])
        }
    };

    const initialize = ()=>{
        for(let i=0; i<3; i++){
            board[i] = [0, 0, 0];
        }
        movesRemaining = 9;
    };

    const makeMove = (x,y)=>{
        if(board[x][y] != 0){
            console.log("Invalid move!");
            return false;
        }
        board[x][y] = currPlayer;
        printToConsole();
        checkMove(x,y);
        currPlayer *= -1;
        return true;
    };
    
    const checkMove = (x,y)=>{
        const checkSum = (sum)=>{
            if(sum === currPlayer*3){
                console.log(`Player [${currPlayer}] wins!`);
                initialize();
                return true;
            }
            return false
        };

        // Check row
        let sum = 0;
        for (let value of board[x]){
            sum += value;
        }
        if(checkSum(sum)){return};

        // Check col
        sum = 0;
        for (let row of board){
            sum += row[y];
        }
        if(checkSum(sum)){return};

        // Check diagonals
        sum = board[0][0] + board[1][1] + board[2][2];
        if(checkSum(sum)){return};

        sum = board[2][0] + board[1][1] + board[0][2];
        if(checkSum(sum)){return};
        
        // Check for draw
        movesRemaining--;
        if(movesRemaining <= 0){
            console.log("Game is a draw.");
            initialize();
            return;
        }
    };
    initialize();
    return{printToConsole,makeMove};
})(); 


function Player(name){
    return {name,
    };
}

