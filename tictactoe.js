const board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];
const tds = Array.from(document.querySelectorAll('td'));
let currentPlayer = 1;
let highlightIndexes = [];
let active = true;
let isAI = false;

function check(boardStates) {
	// 가로, 세로 직선 확인
	for (let i = 0; i < 3; i++) {
		let i3 = i * 3;

		if (boardStates[i].every((value) => boardStates[i][0] === value && value)) {
			highlightIndexes = [i3, i3 + 1, i3 + 2];
			return board[i][0];
		}

		if (boardStates[0][i] === boardStates[1][i] && boardStates[1][i] === boardStates[2][i] && boardStates[0][i]) {
			highlightIndexes = [i, i + 3, i + 6];
			return boardStates[0][i];
		}
	}

	// 대각선 확인
	if (boardStates[0][0] === boardStates[1][1] && boardStates[1][1] === boardStates[2][2] && boardStates[0][0]) {
		highlightIndexes = [0, 4, 8];
		return boardStates[0][0];
	} else if (
		boardStates[0][2] === boardStates[1][1] &&
		boardStates[1][1] === boardStates[2][0] &&
		boardStates[0][2]
	) {
		highlightIndexes = [2, 4, 6];
		return boardStates[0][2];
	}

	// 무승부 확인
	for (let i = 0; i < 3; i++) {
		if (board[i].indexOf(0) !== -1) {
			return -1;
		}
	}

	highlightIndexes = [];
	return 0;
}

// AI 는 Minimax 알고리즘을 사용하여 판단
function ai() {
	const [_, choice] = minimax(board, 2);

	if (choice !== -1) {
		active = true;
		tds[choice[0] * 3 + choice[1]].click();
	}

	const winner = check(board);
	if (winner >= 0) {
		gameOver(winner);
	}

	currentPlayer = 1;
}

function minimax(boardStates, player) {
	const winner = check(boardStates);
	if (winner === 2) {
		return [1, -1];
	} else if (winner === 1) {
		return [-1, -1];
	}

	let move, moveScore;

	if (player === 2) {
		[moveScore, move] = maximize(boardStates);
	} else {
		[moveScore, move] = minimize(boardStates);
	}

	if (move === -1) {
		moveScore = 0;
	}

	return [moveScore, move];
}

function maximize(boardStates) {
	let moveScore = Number.NEGATIVE_INFINITY;
	let move = -1;

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (boardStates[i][j] === 0) {
				const newBoardStates = boardStates.map((r) => r.slice());
				newBoardStates[i][j] = 2;

				const [newMoveScore, _] = minimax(newBoardStates, 1);

				if (newMoveScore > moveScore) {
					move = [i, j];
					moveScore = newMoveScore;
				}
			}
		}
	}

	return [moveScore, move];
}

function minimize(boardStates) {
	let moveScore = Number.POSITIVE_INFINITY;
	let move = -1;

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (boardStates[i][j] === 0) {
				const newBoardStates = boardStates.map((r) => r.slice());
				newBoardStates[i][j] = 1;

				const [newMoveScore, _] = minimax(newBoardStates, 2);

				if (newMoveScore < moveScore) {
					move = [i, j];
					moveScore = newMoveScore;
				}
			}
		}
	}

	return [moveScore, move];
}

function gameOver(p) {
	const resultDiv = document.querySelector('#result');

	if (!p) {
		tds.forEach((e) => {
			e.style.backgroundColor = 'lightgray';
		});

		resultDiv.style.color = 'gray';
	}

	highlightIndexes.forEach((e) => {
		tds[e].style.backgroundColor = p - 1 ? 'blue' : 'red';
	});

	setTimeout(() => {
		document.querySelector('table').style.display = 'none';
		resultDiv.style.display = 'block';

		if (!p) {
			resultDiv.innerHTML = `TIE!<br /><button onclick="location.href = '/'">Main menu</button>`;
			return;
		}

		resultDiv.innerHTML = `<strong>WINNER</strong><br /><i class="fas ${
			p - 1 ? 'fa-o' : 'fa-xmark'
		}" style="color: ${p - 1 ? 'blue' : 'red'}"></i><br /><button onclick="location.href = '/'">Main menu</button>`;
	}, 1500);
}

window.onload = () => {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let idx = i * 3 + j;
			tds[idx].addEventListener('click', () => {
				if (!board[i][j] && active) {
					const is1 = currentPlayer === 1;

					board[i][j] = currentPlayer;
					tds[idx].innerHTML = is1 ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-o"></i>';
					tds[idx].classList.add('active');
					setTimeout(() => tds[idx].classList.remove('active'), 500);

					const winner = check(board);
					if (winner >= 0) {
						gameOver(winner);
					}

					currentPlayer = is1 ? 2 : 1;

					if (currentPlayer === 2 && isAI) {
						active = false;
						setTimeout(() => ai(), 500);
					}
				}
			});
		}
	}

	isAI = new URLSearchParams(location.search).get('ai') === 'true';
};
