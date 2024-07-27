const Game = (function(){
    const restartButton = document.querySelector(".restart-button");
    restartButton.onclick = ()=>{
        Gameboard.initialize();
        DisplayController.restart();
    };
})();

const Gameboard = (function(){
    const board = [];
    let movesRemaining = 9;
    let currPlayer = 1; //1 represents X, -1 represents O
    let gameOver = false;
    let xScore = 0;
    let oScore = 0;

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
        gameOver = false;
        currPlayer = 1;
    };

    const makeMove = (x,y)=>{
        if(board[x][y] != 0 || gameOver == true){
            console.log("Invalid move!");
            return false;
        }
        board[x][y] = currPlayer;
        DisplayController.drawSymbol(currPlayer, x, y);
        printToConsole();
        checkMove(x,y);
        currPlayer *= -1;
        DisplayController.togglePlayerIndicator();
        return true;
    };
    
    const checkMove = (x,y)=>{
        const checkSum = (sum)=>{
            if(sum === currPlayer*3){
                if(currPlayer === 1){
                    xScore++;
                    DisplayController.updateMsgBoard("x-win");
                }
                else{
                    oScore++;
                    DisplayController.updateMsgBoard("o-win");

                }
                console.log(`Player [${currPlayer}] wins!   Score: [${xScore}] to [${oScore}]`);
                DisplayController.updateScore(xScore, oScore);
                gameOver = true;
                return true;
            }
            return false
        };

        // Check row
        let sum = 0;
        for (let value of board[x]){
            sum += value;
        }
        if(checkSum(sum)){
            DisplayController.highlight("row", x);
            return; 
        };

        // Check col
        sum = 0;
        for (let row of board){
            sum += row[y];
        }
        if(checkSum(sum)){
            DisplayController.highlight("col", y);
            return;
        };

        // Check diagonals
        sum = board[0][0] + board[1][1] + board[2][2];
        if(checkSum(sum)){
            DisplayController.highlight("diagonal", 1);
            return;
        };

        sum = board[2][0] + board[1][1] + board[0][2];
        if(checkSum(sum)){
            DisplayController.highlight("diagonal", 2);
            return;
        };
        
        // Check for draw
        movesRemaining--;
        if(movesRemaining <= 0){
            console.log("Game is a draw.");
            DisplayController.updateMsgBoard("draw");
            gameOver = true;
            return;
        }
    };
    initialize();
    return{initialize, printToConsole, makeMove};
})(); 

const DisplayController = (function(){

    let x_SVG = '<svg class="x-svg" fill="#000000" height="0px" width="0px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xml:space="preserve"><path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path></svg>'
    let o_SVG = '<svg class="o-svg" width="0px" height="0px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

    let xScoreElement = document.querySelector(".x-score");
    let oScoreElement = document.querySelector(".o-score");
    let msgBoard = document.querySelector(".msg-board");

    let initialize = (destination = document.body)=>{
        this.table = document.createElement('table');
        this.tbody = document.createElement('tbody');
        this.table.appendChild(this.tbody);
        this.table.setAttribute("class", "game-board");

        for(let row=0; row<3; row++){
            this.tbody.insertRow(row);
            for(let col=0; col<3; col++){
                this.tbody.rows[row].insertCell(col);
                this.tbody.rows[row].cells[col].setAttribute('data-row',row);
                this.tbody.rows[row].cells[col].setAttribute('data-col',col);
            }
        }
        this.tbody.onclick = (e)=>{
            if(e.target.nodeName.toLowerCase() === "td"){
                Gameboard.makeMove(e.target.dataset.row, e.target.dataset.col);
            }
        };
        destination.appendChild(this.table);
    };

    let drawSymbol = (symbol, row, col) =>{
        // 1 = X, -1 = O
        let symbol_SVG;
        if(symbol === 1){
            symbol_SVG = x_SVG;
        }
        else if(symbol === -1){
            symbol_SVG = o_SVG;
        }
        else{
            console.log("Error: symbol not recognised");
            return false;
        }
        if(row < 0 || row > 2 || col < 0 || col > 2){
            console.log("Error: out of bounds");
            return false;
        }
        this.tbody.rows[row].cells[col].innerHTML = symbol_SVG;
        return true;
    };

    let updateScore = (xScore, oScore)=>{
        xScoreElement.innerText = xScore;
        oScoreElement.innerText = oScore;
    };

    let togglePlayerIndicator = ()=>{
        xScoreElement.parentElement.classList.toggle("highlight");
        oScoreElement.parentElement.classList.toggle("highlight");
    };

    let updateMsgBoard = (gameState)=>{
        if(gameState === "x-win"){
            msgBoard.innerHTML = '<svg fill="#f5f5f5" height="50px" width="50px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xml:space="preserve"><path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path></svg> Wins!'
        }
        else if(gameState === "o-win"){
            msgBoard.innerHTML = '<svg width="75px" height="75px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#f5f5f5"><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>Wins!' 
        }
        else if(gameState === "draw"){
            msgBoard.innerText = 'Draw!';
        }
        else if(gameState === "new"){
            msgBoard.innerText = 'Tic Tac Toe';
        }
    }

    let highlight = (direction, index)=>{
        if(direction === "row"){
            setTimeout(()=>this.tbody.rows[index].cells[0].classList.toggle("highlight"), 100);
            setTimeout(()=>this.tbody.rows[index].cells[1].classList.toggle("highlight"), 200);
            setTimeout(()=>this.tbody.rows[index].cells[2].classList.toggle("highlight"), 300);
        }
        else if(direction === "col"){
            setTimeout(()=>this.tbody.rows[0].cells[index].classList.toggle("highlight"), 100);
            setTimeout(()=>this.tbody.rows[1].cells[index].classList.toggle("highlight"), 200);
            setTimeout(()=>this.tbody.rows[2].cells[index].classList.toggle("highlight"), 300);
        }
        else if(direction === "diagonal" && index === 1){
            setTimeout(()=>this.tbody.rows[0].cells[0].classList.toggle("highlight"), 100);
            setTimeout(()=>this.tbody.rows[1].cells[1].classList.toggle("highlight"), 200);
            setTimeout(()=>this.tbody.rows[2].cells[2].classList.toggle("highlight"), 300);
        }
        else if(direction === "diagonal" && index === 2){
            setTimeout(()=>this.tbody.rows[2].cells[0].classList.toggle("highlight"), 100);
            setTimeout(()=>this.tbody.rows[1].cells[1].classList.toggle("highlight"), 200);
            setTimeout(()=>this.tbody.rows[0].cells[2].classList.toggle("highlight"), 300);
        }
    };

    let restart = ()=>{
        this.table.remove();
        initialize(destination);
        xScoreElement.parentElement.classList.add("highlight");
        oScoreElement.parentElement.classList.remove("highlight");
        updateMsgBoard("new");
    };

    let destination = document.querySelector(".game-container");
    initialize(destination);
    return{drawSymbol, highlight, destination, restart, updateScore, togglePlayerIndicator, updateMsgBoard};

})();
