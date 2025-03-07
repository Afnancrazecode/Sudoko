    // Sudoku puzzle generator (example puzzle)
    const puzzles = {
        easy: [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ],
        medium: [
            [0, 0, 0, 0, 8, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 5, 0, 0, 0],
            [5, 3, 0, 0, 0, 7, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 0, 9, 0],
            [0, 0, 0, 8, 0, 0, 7, 5, 0],
            [0, 0, 4, 0, 9, 0, 0, 0, 0],
            [0, 6, 0, 0, 0, 0, 0, 0, 9],
            [0, 0, 3, 0, 7, 0, 8, 0, 5],
            [0, 0, 0, 9, 6, 0, 0, 4, 0]
        ],
        hard: [
            [0, 0, 4, 0, 0, 0, 9, 3, 0],
            [0, 0, 0, 5, 0, 3, 0, 0, 0],
            [3, 0, 7, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 3, 0, 0, 4, 5, 0],
            [5, 0, 0, 0, 0, 0, 0, 0, 7],
            [0, 7, 0, 9, 6, 4, 0, 8, 0],
            [0, 6, 0, 0, 0, 9, 3, 0, 0],
            [0, 0, 0, 8, 0, 0, 0, 6, 0],
            [0, 0, 9, 0, 0, 7, 0, 0, 0]
        ]
    };

    let currentPuzzle = JSON.parse(JSON.stringify(puzzles.easy));
    let timerInterval;
    let time = 0;

    function startTimer() {
        timerInterval = setInterval(() => {
            time++;
            document.getElementById('timer').innerText = `Time: ${formatTime(time)}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }

    function renderGrid() {
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';
        currentPuzzle.forEach((row, i) => {
            row.forEach((cell, j) => {
                const gridCell = document.createElement('div');
                gridCell.className = 'grid-cell';
                if (cell !== 0) {
                    gridCell.classList.add('readonly');
                    gridCell.innerText = cell;
                } else {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = 1;
                    input.max = 9;
                    input.addEventListener('input', (e) => {
                        currentPuzzle[i][j] = parseInt(e.target.value) || 0;
                    });
                    gridCell.appendChild(input);
                }
                gridContainer.appendChild(gridCell);
            });
        });
    }

    function validateSolution() {
        const isValid = currentPuzzle.every((row, i) => {
            return row.every((cell, j) => {
                if (cell === 0) return false;
                const rowSet = new Set();
                const colSet = new Set();
                const subgridSet = new Set();
                for (let k = 0; k < 9; k++) {
                    if (rowSet.has(currentPuzzle[i][k]) || colSet.has(currentPuzzle[k][j])) return false;
                    rowSet.add(currentPuzzle[i][k]);
                    colSet.add(currentPuzzle[k][j]);
                    const subRow = Math.floor(i / 3) * 3 + Math.floor(k / 3);
                    const subCol = Math.floor(j / 3) * 3 + k % 3;
                    if (subgridSet.has(currentPuzzle[subRow][subCol])) return false;
                    subgridSet.add(currentPuzzle[subRow][subCol]);
                }
                return true;
            });
        });
        return isValid;
    }

    document.getElementById('check-btn').addEventListener('click', () => {
        if (validateSolution()) {
            showModal('Congratulations! Your solution is correct.', true);
            stopTimer();
        } else {
            showModal('Oops! There are errors in your solution.', false);
        }
    });

    function showModal(message, isSuccess) {
        const modal = document.getElementById('modal');
        const overlay = document.getElementById('overlay');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.innerText = message;
        modalMessage.style.color = isSuccess ? 'green' : 'red';
        modal.classList.add('show');
        overlay.classList.add('show');
    }

    document.getElementById('close-modal').addEventListener('click', () => {
        const modal = document.getElementById('modal');
        const overlay = document.getElementById('overlay');
        modal.classList.remove('show');
        overlay.classList.remove('show');
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        const difficulty = document.getElementById('difficulty').value;
        currentPuzzle = JSON.parse(JSON.stringify(puzzles[difficulty]));
        renderGrid();
        stopTimer();
        time = 0;
        document.getElementById('timer').innerText = 'Time: 00:00';
        startTimer();
        document.getElementById('message').innerText = '';
    });

    document.getElementById('difficulty').addEventListener('change', () => {
        const difficulty = document.getElementById('difficulty').value;
        currentPuzzle = JSON.parse(JSON.stringify(puzzles[difficulty]));
        renderGrid();
        stopTimer();
        time = 0;
        document.getElementById('timer').innerText = 'Time: 00:00';
        startTimer();
    });

    // Initialize the game
    renderGrid();
    startTimer();