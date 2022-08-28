const board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];
const tds = Array.from(document.querySelectorAll('td'));
let currentPlayer = 1;
let highlightIndexes = [];

function check() {
	// 가로, 세로 직선 확인
	for (let i = 0; i < 3; i++) {
		let i3 = i * 3;

		if (board[i].every((value) => board[i][0] === value && value)) {
			highlightIndexes = [i3, i3 + 1, i3 + 2];
			gameOver(board[i][0]);
		}

		if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i]) {
			highlightIndexes = [i, i + 3, i + 6];
			gameOver(board[0][i]);
		}
	}

	// 대각선 확인
	if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0]) {
		highlightIndexes = [0, 4, 8];
		gameOver(board[0][0]);
	} else if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2]) {
		highlightIndexes = [2, 4, 6];
		gameOver(board[0][2]);
	}

	// 무승부 확인
	for (let i = 0; i < 3; i++) {
		if (board[i].indexOf(0) !== -1) {
			return;
		}
	}

	highlightIndexes = [];
	gameOver(0);
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
			resultDiv.innerHTML = 'TIE!<br /><button onclick="location.reload()">Restart</button>';
			return;
		}

		resultDiv.innerHTML = `<strong>WINNER</strong><br /><i class="fas ${
			p - 1 ? 'fa-o' : 'fa-xmark'
		}" style="color: ${p - 1 ? 'blue' : 'red'}"></i><br /><button onclick="location.reload()">Restart</button>`;
	}, 1500);
}

for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {
		let idx = i * 3 + j;
		tds[idx].addEventListener('click', () => {
			if (!board[i][j]) {
				let is1 = currentPlayer === 1;

				board[i][j] = currentPlayer;
				tds[idx].innerHTML = is1 ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-o"></i>';

				check();

				currentPlayer = is1 ? 2 : 1;
			}
		});
	}
}
