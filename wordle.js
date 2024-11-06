import { randomWords } from "/words.js";
const keyboardButton = document.querySelectorAll(".keyboard-button");
let selectedWord;
const gridBlocks = document.querySelectorAll(".grid-blocks");
let activeIndex = 0;
let currentRow = 0;
const rowLength = 5;
const popUp = document.querySelector(".popup-Box");
const lowerCaseWords = randomWords.map(function (item) {
  return item.toLowerCase();
});

function initialize() {
  const randomIndex = Math.floor(Math.random() * lowerCaseWords.length);
  selectedWord = lowerCaseWords[randomIndex];
  console.log(selectedWord);
}

initialize();

document.addEventListener("keydown", function (event) {
  handlekeyAction(event.key);
});

function handlekeyAction(key) {
  if (key === "Backspace") {
    if (activeIndex > 0) {
      activeIndex--;
      const currentGrid = gridBlocks[currentRow * rowLength + activeIndex];
      currentGrid.textContent = "";
    }
  } else if (/^[a-z]$/.test(key) && activeIndex < rowLength) {
    const currentGrid = gridBlocks[currentRow * rowLength + activeIndex];
    currentGrid.textContent = key;
    activeIndex++;
    console.log("Active index:", activeIndex);

    if (activeIndex === rowLength) {
      console.log("checkWord");
      checkWord();
    }
  }
}

function checkWord() {
  let typedWord = "";
  let selectedWordArray = selectedWord.split("");
  let checkedLetter = [];

  let feedbackColors = new Array(rowLength).fill("red");

  for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
    const currentGrid = gridBlocks[currentRow * rowLength + rowIndex];
    typedWord += currentGrid.textContent;

    if (currentGrid.textContent === selectedWordArray[rowIndex]) {
      feedbackColors[rowIndex] = "green";
      checkedLetter.push(rowIndex);
    }
  }
  for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
    if (feedbackColors[rowIndex] === "green") continue;

    for (let j = 0; j < rowLength; j++) {
      if (checkedLetter.includes(j)) continue;
      if (typedWord[rowIndex] === selectedWordArray[j]) {
        feedbackColors[rowIndex] = "#cccc00";
        checkedLetter.push(j);
        break;
      }
    }
  }
  console.log("Typed word:", typedWord);

  for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
    const currentGrid = gridBlocks[currentRow * rowLength + rowIndex];
    currentGrid.style.color = feedbackColors[rowIndex];
  }

  if (typedWord === selectedWord) {
    console.log("you guessed it");
    alert("you guessed the word");
    gridBlocks.forEach((grid) => (grid.style.color = "#009933"));
  } else {
    console.log("you're wrong");
    if (currentRow < gridBlocks.length / rowLength - 1) {
      currentRow++;
      activeIndex = 0;
    }
    if (activeIndex === 5) {
      console.log("game finished!!!");
      alert("Game Over!!");
    }
  }
}

// link buttons
// make the points counter
// make a pop up with some info and next round button
