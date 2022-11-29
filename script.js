'use strict';

const game = (() => {
  const X_CLASS = 'x';
  const CIRCLE_CLASS = 'circle';
  const restartButton = document.getElementById('restartButton');
  const cellElements = document.querySelectorAll('[data-cell]');
  let circleTurn;
  return { X_CLASS, CIRCLE_CLASS, cellElements, circleTurn, restartButton };
})();

const gameController = (() => {
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const swapTurns = () => {
    game.circleTurn = !game.circleTurn;
  };

  const isDraw = () => {
    return [...game.cellElements].every((cell) => {
      return (
        cell.classList.contains(game.X_CLASS) ||
        cell.classList.contains(game.CIRCLE_CLASS)
      );
    });
  };

  const checkWin = (currentClass) => {
    return WINNING_COMBINATIONS.some((combination) => {
      return combination.every((index) => {
        return game.cellElements[index].classList.contains(currentClass);
      });
    });
  };

  return {
    swapTurns,
    isDraw,
    checkWin,
  };
})();

const displayController = (() => {
  const board = document.getElementById('board');
  const winningMessageElement = document.getElementById('winningMessage');
  const winningMessageTextElement = document.querySelector(
    '[data-winning-message-text]'
  );
  const placeMark = (cell, currentClass) => {
    cell.classList.add(currentClass);
  };

  const setBoardHoverClass = () => {
    board.classList.remove(game.X_CLASS);
    board.classList.remove(game.CIRCLE_CLASS);
    if (game.circleTurn) {
      board.classList.add(game.CIRCLE_CLASS);
    } else {
      board.classList.add(game.X_CLASS);
    }
  };

  const endGame = (draw) => {
    if (draw) {
      winningMessageTextElement.innerText = 'Draw!';
    } else {
      winningMessageTextElement.innerText = `${
        game.circleTurn ? "O's" : "X's"
      } Wins!`;
    }
    winningMessageElement.classList.add('show');
  };

  const startGame = () => {
    game.circleTurn = false;
    game.cellElements.forEach((cell) => {
      cell.classList.remove(game.X_CLASS);
      cell.classList.remove(game.CIRCLE_CLASS);
      cell.removeEventListener('click', handleClick);
      cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
  };

  const handleClick = (e) => {
    const cell = e.target;
    const currentClass = game.circleTurn ? game.CIRCLE_CLASS : game.X_CLASS;
    placeMark(cell, currentClass);
    if (gameController.checkWin(currentClass)) {
      endGame(false);
    } else if (gameController.isDraw()) {
      endGame(true);
    } else {
      gameController.swapTurns();
      setBoardHoverClass();
    }
  };

  return { startGame };
})();

displayController.startGame();
game.restartButton.addEventListener('click', displayController.startGame);
