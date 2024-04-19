let level = 0;
const maxLevel = 15;
let numSquares = 3;
let speed = 106;
let intervalID;
// Direction 0 = right, 1 = left
let direction;
let leftSquare;
let rightSquare;
let previousSquares = [];
let canHandleKeydown = true;
const keydownDelay = 5;

function startGame() {
  // Reset global variables to default values
  level = 1;
  numSquares = 3;
  speed = 132;
  previousSquares = [0, 1, 2, 3, 4, 5, 6];

  // Remove start screen
  const screens = document.querySelectorAll(".game");
  screens.forEach(screen => {
    screen.classList.add("hidden");
  });

  // Clear all squares
  const squares = document.querySelectorAll(".square");
  squares.forEach(square => {
    square.classList.remove("filled");
  });

  // Select first 3 squares of the first level to fill in
  const row = document.querySelectorAll(".level-1 > .square");

  for(let i = 0; i < numSquares; i++) {
    row[i].classList.add("filled");
  }

  leftSquare = 0;
  rightSquare = 2;

  direction = Math.floor(Math.random() * 2);

  // Create interval to move squares back and forth
  
  intervalID = setInterval(moveSquares, speed);

}

function moveSquares() {
  if(direction) {
    // If squares are at the left edge, change direction to right
    if(rightSquare === 0) {
      direction = 0;
      moveRight();
    }
    else {
      moveLeft();
      if(rightSquare === 0) {
        makeSound(true);
      }
      else {
        makeSound();
      }
    }
  }
  else {
    // If squares are at the right edge, change direction to left
    if(leftSquare === 6) {
      direction = 1;
      moveLeft();
    }
    else {
      moveRight();
      if(leftSquare === 6) {
        makeSound(true);
      }
      else {
        makeSound();
      }
    }
  }
}

function moveLeft() {
  --leftSquare;
  --rightSquare;

  const row = document.querySelectorAll(`.level-${level} > .square`);

  row.forEach((square, index) => {
    if(index >= leftSquare && index <= rightSquare) {
      square.classList.add("filled");
    }
    else {
      square.classList.remove("filled");
    }
  });
}

function moveRight() {
  ++leftSquare;
  ++rightSquare;

  const row = document.querySelectorAll(`.level-${level} > .square`);

  row.forEach((square, index) => {
    if(index >= leftSquare && index <= rightSquare) {
      square.classList.add("filled");
    }
    else {
      square.classList.remove("filled");
    }
  });
}

function makeSound(edge = false) {
  if(edge) {
    const moveSound = new Audio("./sounds/snare.mp3");
    moveSound.volume = 0.3;
    moveSound.play();
  }
  else {
    const moveSound = new Audio("./sounds/kick-bass.mp3");
    moveSound.volume = 0.3;
    moveSound.play();
  }
}

function gameOver() {
  document.querySelector(".lose").classList.remove("hidden");
  level = 0;
  const loseSound = new Audio("./sounds/losing-sound.wav");
  loseSound.volume = 0.3;
  loseSound.play();
}

function gameWin() {
  document.querySelector(".win").classList.remove("hidden");
  level = 0;
  const winSound = new Audio("./sounds/complete-sound.wav");
  winSound.volume = 0.3;
  winSound.play();
}

function checkState() {
  const currentSquares = [];
  const newSquares = [];

  // Get the current squares into an array
  for(let i = leftSquare; i <= rightSquare; i++) {
    if(i >= 0 && i <= 6) {
      currentSquares.push(i);
    }
    else {
      --numSquares;
    }
  }

  // Check if the current squares are above the previous level squares
  currentSquares.forEach(square => {
    if(previousSquares.includes(square)) {
      newSquares.push(square);
    }
    else {
      // If squares are not above the previous level squares, clear the square
      --numSquares;
      document.querySelector(`.level-${level} .square-${square}`).classList.remove("filled");
    }
  });

  // If there are no more squares, the game is over
  if(numSquares < 1) {
    gameOver();
  }
  else {
    // If squares are left and max level achieved then game has been won
    if(level === maxLevel) {
      gameWin();
    }
    else {
      // If game was not won, increase level and interval speed, then reset interval
      previousSquares = newSquares;
      ++level;
      speed -= 3;

      if(level === 4 && numSquares > 2) {
        numSquares = 2;
      }
      else if(level === 10 && numSquares > 1) {
        numSquares = 1;
      }

      // Show current squares on the new level randomly and set direction
      const row = document.querySelectorAll(`.level-${level} > .square`);
      const random = Math.floor(Math.random() * (8 - numSquares));

      leftSquare = random;
      rightSquare = random + numSquares - 1;

      for(let i = random; i < random + numSquares; i++) {
        row[i].classList.add("filled");
      }

      direction = Math.floor(Math.random() * 2);

      // Reset interval
      intervalID = setInterval(moveSquares, speed);
    }
  }
}

function handleKeydown() {
  if (canHandleKeydown) {
    // Disable keydown handling temporarily to prevent spamming
    canHandleKeydown = false; 

    if (level === 0) {
      startGame();
    } else {
      clearInterval(intervalID);
      checkState();
    }

    // Enable keydown handling after the delay
    setTimeout(() => {
      canHandleKeydown = true;
    }, keydownDelay);
  }
}

document.addEventListener("keydown", handleKeydown);
document.addEventListener("mousedown", handleKeydown);