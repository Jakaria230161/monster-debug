// Welcome to my script js 

// display id 
const display = document.getElementById("display");
const question = document.getElementById("question");
const startBtn = document.getElementById("start");
const countdownOverlay = document.getElementById("countdown");
const resultModal = document.getElementById("result");
const modalBackground = document.getElementById("modal-background");

// variables starting here
let userText = "";
let errorCount = 0;
let startTime;
let questionText = "";

// Here Loading and displaying question
fetch("./texts.json")
  .then((res) => res.json())
  .then((data) => {
    questionText = data[Math.floor(Math.random() * data.length)];
    question.innerHTML = questionText;
  });

// check the user typed character and displays
const typeController = (e) => {
  const newLetter = e.key;

  // Handling backspace press buttons
  if (newLetter == "Backspace") {
    userText = userText.slice(0, userText.length - 1);
    return display.removeChild(display.lastChild);
  }

  // these are the valid character  that's why we allowing to type here
  const validLetters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890!@#$%^&*()_+-={}[]'\".,?";

  // if it is not a valid character like Control/Alt then skip displaying anything
  if (!validLetters.includes(newLetter)) {
    return;
  }

  userText += newLetter;

  const newLetterCorrect = validate(newLetter);

  if (newLetterCorrect) {
    display.innerHTML += `<span class="green">${newLetter === " " ? "▪" : newLetter}</span>`;
  } else {
    display.innerHTML += `<span class="red">${newLetter === " " ? "▪" : newLetter}</span>`;
    errorCount++;
  }

  // check if given question text is equal to user typed text
  if (questionText === userText) {
    gameOver();
  }
};

const validate = (key) => {
  if (key === questionText[userText.length - 1]) {
    return true;
  }
  return false;
};

// Finished time here
const gameOver = () => {
  document.removeEventListener("keydown", typeController);
  // the current time is the finish time
  // so total time taken is current time - start time
  const finishTime = new Date().getTime();
  const timeTaken = (finishTime - startTime) / 1000;

  // showing the result modal here
  resultModal.innerHTML = "";
  resultModal.classList.toggle("hidden");
  modalBackground.classList.toggle("hidden");
  // clear user text here
  display.innerHTML = "";
  // make it inactive here
  display.classList.add("inactive");
  // show result here
  resultModal.innerHTML += `
    <h1>Finished!</h1>
    <p>You took: <span class="bold">${parseInt(timeTaken)}</span> seconds</p>
    <p>You made <span class="bold red">${parseInt(errorCount)}</span> mistakes</p>
    <button onclick="closeModal()">Close</button>
  `;

  addHistory(questionText, timeTaken, errorCount);

  // restart everything here
  startTime = null;
  errorCount = 0;
  userText = "";
  display.classList.add("inactive");
};

const closeModal = () => {
  modalBackground.classList.toggle("hidden");
  resultModal.classList.toggle("hidden");
};

const start = () => {
  // If already started, do not start again. okay
  if (startTime) return;

  let count = 3;
  countdownOverlay.style.display = "flex";

  const startCountdown = setInterval(() => {
    countdownOverlay.innerHTML = `<h1>${count}</h1>`;

    // finished timer here
    if (count === 0) {
      // -------------- Start typing here-----------------
      document.addEventListener("keydown", typeController);
      countdownOverlay.style.display = "none";
      display.classList.remove("inactive");

      clearInterval(startCountdown);
      startTime = new Date().getTime();
    }
    count--;
  }, 1000);
};

// Starting Countdown here 
startBtn.addEventListener("click", start);
// If history exists, then it would be show 
displayHistory();

// Showing typing time spent here
setInterval(() => {
  const currentTime = new Date().getTime();
  const timeSpent = (currentTime - startTime) / 1000;


  document.getElementById("show-time").innerHTML = `${startTime ? parseInt(timeSpent) : 0} seconds`;
}, 1000);

// Thank you so much programming hero teams