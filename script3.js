var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[6,4,2]
]

const cells = document.querySelectorAll('.cell'); /*select all references of '.cell' from html*/
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none" /*upon hitting replay button, hide endgame display*/
	origBoard = Array.from(Array(9).keys()) /*create an array from 0 to 9*/
	for (var i = 0; i<cells.length; i++) { /* go through every cell to reset x and o when restart a game*/
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false); /* call turnClick function everytime clicking a cell*/
	}
}

function turnClick(square) { /* pass in a click event to the turnClick function*/
	/*console.log(square.target.id) log the id of whichever square clicked*/
	if (typeof origBoard[square.target.id] == 'number') {/* cannot click on a place that's already been clicked. 
		When a turn is taken, origBoard's value change from number to 'X' or 'O'*/
		turn(square.target.id, huPlayer) /* call and pass id to the turn function*/
		if (!checkTie()) turn(bestSpot(), aiPlayer); /* check if the game is tie, if it is, AI doesn't take turn; otherwise it does*/
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player; /* set origBard array value to player*/
	document.getElementById(squareId).innerText = player; /* squareId are 0 to 9, set by html*/
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => /*find places on the board that player has played in, iterates through elements (e) of board*/
		(e === player) ? a.concat(i) : a, []); /* a is the accumulator, initialize as [], is the value get at the end; i is index*/
	let gameWon = null;
	for (let [index, win] of winCombos.entries()){ /* loop through winCombos possibilities*/
		if (win.every(elem => plays.indexOf(elem)>-1)){ /*check if elements of wincombo option are taken*/
			gameWon = {index: index, player: player};
			break;
		}

	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) { /* pass in index of the win combo*/
		document.getElementById(index).style.backgroundColor = 
			gameWon.player == huPlayer ? "blue" : "red"; /* if human won, blue, otherwise, red*/
	}
	for (var i=0; i < cells.length; i++) { /* goes through every cell so that you can't click cell anymore*/
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lose!");
}

function declareWinner(who){
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
	return origBoard.filter(s => typeof s == 'number'); /* find all the squares that are empty*/
}

function bestSpot(){
	/*return emptySquares()[0];  best spot is the first square that's not empty*/
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0){ /* when empty squares are filled up*/
		for (var i = 0; i < cells.length; i++){
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click',  turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

/* MinMax algorithm:
1) return a value if a terminal state is found (+10, 0, -10)
2) go through available spots on the board
3) call the minimax function on each available spot (recursion)
4) evaluate returning values from function calls
5) return the best value */

function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard); /* find index of available spots*/

	if (checkWin(newBoard, huPlayer)) { /* check terminal states: if human wins, return -10, else return +10*/
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) { /* no more game to play, tie, should return 0 */
		return {score: 0};
	}
	var moves = []; /* collect index and score from each of the availSpots and evaluate later */
	for (var i =0; i < availSpots.length; i++){
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player; /* then set empty spot to the current player, 
		then all minimax function of the other player of the newly changed board, the function runs recursively */

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;
		moves.push(move); /*push the array */
	}
	var bestMove;
	if(player === aiPlayer) { /* in the move array, if a move has score > bestScore, algorithm store the move*/
		var bestScore = -10000; /* only the first move will be stored if there are moves with similar score*/
		for (var i=0; i<moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i=0; i<moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}











