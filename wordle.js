import { randomWords } from "/words.js";

let score = 0,
  streak = 0,
  currentRow = 0,
  activeIndex = 0;
let selectedWord;
let selectedWordArray;
let lastWord = "You will see the last round word here";
const rowLength = 5;
const popupBox = document.getElementById("popup-box");
const popupMessage = document.getElementById("popup-message");
const nextRoundBtn = document.getElementById("next-round-button");
const gridBlocks = document.querySelectorAll(".grid-blocks");
const lastWordElement = document.getElementById("js-last-word");
const streakElement = document.getElementById("js-streak-amount");
const scoreElement = document.getElementById("score");
const keyboardButtons = document.querySelectorAll(".keyboard-button");
const lowerCaseWords = randomWords.map(function (item) {
  return item.toLowerCase();
});

function initialize() {
  const randomIndex = Math.floor(Math.random() * lowerCaseWords.length);
  selectedWord = lowerCaseWords[randomIndex];
  console.log(selectedWord);
  selectedWordArray = selectedWord.split("");
  updateGameInfo();
}

initialize();

document.addEventListener("keydown", function (event) {
  handlekeyAction(event.key);
});

keyboardButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const buttonText = button.textContent;
    if (buttonText === "⌫") {
      handlekeyAction("Backspace");
    }
    handlekeyAction(buttonText);
  });
});

function handlekeyAction(key) {
  key = key.toLowerCase();
  if (key === "backspace") {
    if (activeIndex > 0) {
      activeIndex--;
      const currentBlock = gridBlocks[currentRow * rowLength + activeIndex];
      currentBlock.textContent = "";
    }
  } else if (/^[a-zA-Z]$/.test(key) && activeIndex < rowLength) {
    const currentBlock = gridBlocks[currentRow * rowLength + activeIndex];
    currentBlock.textContent = key;
    activeIndex++;
    console.log("Active index:", activeIndex);

    if (activeIndex === rowLength) {
      console.log("checkWord");
      checkWord();
    }
  }
}

function showPopup(message) {
  popupMessage.textContent = message;
  scoreElement.textContent = score;
  popupBox.style.display = "block";

  nextRoundBtn.addEventListener(
    "click",
    function () {
      currentRow = 0;
      activeIndex = 0;
      gridBlocks.forEach((block) => {
        block.textContent = "";
        block.style.color = "";
      });
      keyboardButtons.forEach((button) => {
        button.style.backgroundColor = "";
      });

      initialize();
      popupBox.style.display = "none";
    },
    { once: true }
  );
}

function checkWord() {
  let typedWord = "";
  let checkedLetters = [];
  let feedbackColors = new Array(rowLength).fill("red");

  for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
    const currentBlock = gridBlocks[currentRow * rowLength + rowIndex];
    const letter = currentBlock.textContent.toLowerCase();
    typedWord += currentBlock.textContent;

    if (letter === selectedWordArray[rowIndex]) {
      feedbackColors[rowIndex] = "green";
      checkedLetters.push(rowIndex);
    } else if (
      selectedWordArray.includes(letter) &&
      !checkedLetters.includes(rowIndex)
    ) {
      feedbackColors[rowIndex] = "#cccc00";
      checkedLetters.push(rowIndex);
    }

    currentBlock.style.color = feedbackColors[rowIndex];
    keyboardButtonsColor(typedWord[rowIndex], feedbackColors[rowIndex]);
  }
  console.log("Typed word:", typedWord);

  if (typedWord.toLowerCase() === selectedWord) {
    console.log("you guessed it");
    score++;
    streak++;
    lastWord = selectedWord;
    showPopup(`congratulation!! You guessed the word: ${selectedWord}`);
  } else {
    console.log("you're wrong");
    if (currentRow < gridBlocks.length / rowLength - 1) {
      currentRow++;
      activeIndex = 0;
    }
    if (activeIndex === 5) {
      console.log(`game finished!!!`);
      lastWord = selectedWord;
      showPopup(`Game Over !!!!!, the word was: ${selectedWord}`);
      score = 0;
      streak = 0;
    }
  }
  updateGameInfo();
}

function keyboardButtonsColor(letter, color) {
  const button = document.querySelector(
    `.keyboard-button[data-key="${letter}"]`
  );
  if (button) {
    if (
      color === "red" &&
      button.style.backgroundColor !== "green" &&
      button.style.backgroundColor !== "cccc00"
    ) {
      button.style.backgroundColor = "red";
    }
  }
  if (color === "green") {
    button.style.backgroundColor = "green";
    return;
  } else if (
    color === "#cccc00" &&
    button.style.backgroundColor !== "green" &&
    button.style.backgroundColor !== "#cccc00"
  ) {
    button.style.backgroundColor = "#cccc00";
  }
}

function updateGameInfo() {
  streakElement.textContent = streak;
  lastWordElement.textContent = lastWord;
}
