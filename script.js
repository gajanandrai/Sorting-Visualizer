let array = [];
let speed = 100;
let steps = 0;
let passes = 0;
let isPaused = false;

// ✅ Sound setup
const tickSound = new Audio('tick.mp3');
const successSound = new Audio('success.mp3');
tickSound.volume = 0.2;
successSound.volume = 0.4;

tickSound.onerror = () => console.warn("tick.mp3 not found.");
successSound.onerror = () => console.warn("success.mp3 not found.");

function playTick() {
  if (!isPaused) {
    tickSound.currentTime = 0;
    tickSound.play();
  }
}

function playSuccess() {
  successSound.currentTime = 0;
  successSound.play();
}

function generateArray(size = 50) {
  array = [];
  steps = 0;
  passes = 0;
  updateStepCounter();
  updatePassCounter();
  hideCompleteMessage();
  document.getElementById("pauseResumeBtn").style.display = "none";
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 600) - 300);
  }
  updateArrayDisplay();
  renderBars();
}

function getNormalizedHeight(value) {
  const min = Math.min(...array);
  const max = Math.max(...array);
  const range = max - min || 1;
  return ((value - min) / range) * 290 + 10;
}

function renderBars() {
  const container = document.getElementById("array-container");
  container.innerHTML = '';
  array.forEach(value => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${getNormalizedHeight(value)}px`;

    const label = document.createElement("div");
    label.classList.add("bar-value");
    label.innerText = value;

    bar.appendChild(label);
    container.appendChild(bar);
  });
}

function updateArrayDisplay() {
  document.getElementById("current-array-display").textContent = `Current Array: [ ${array.join(', ')} ]`;
}

function updateStepCounter() {
  document.getElementById("step-counter").textContent = `Steps: ${steps}`;
}

function updatePassCounter() {
  document.getElementById("pass-counter").textContent = `Passes: ${passes}`;
}

function showCompleteMessage() {
  document.getElementById("complete-message").style.display = "block";
  document.getElementById("pauseResumeBtn").style.display = "none";
}

function hideCompleteMessage() {
  document.getElementById("complete-message").style.display = "none";
}

function sleep(ms) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (!isPaused) {
        clearInterval(interval);
        resolve();
      }
    }, 10);
  }).then(() => new Promise(r => setTimeout(r, ms)));
}

document.getElementById("speedRange").addEventListener("input", e => {
  speed = parseInt(e.target.value);
});

async function startSorting() {
  const input = document.getElementById("arrayInput").value.trim();
  const algo = document.getElementById("algorithmSelect").value;

  if (input.length > 0) {
    try {
      array = input.split(',').map(num => parseInt(num.trim()));
      if (array.some(isNaN)) throw "Invalid input";
    } catch {
      alert("Please enter a valid comma-separated array like: 4, -2, 7, 0");
      return;
    }
  }

  steps = 0;
  passes = 0;
  updateStepCounter();
  updatePassCounter();
  updateArrayDisplay();
  renderBars();
  hideCompleteMessage();
  isPaused = false;
  document.getElementById("pauseResumeBtn").textContent = "Pause";
  document.getElementById("pauseResumeBtn").style.display = "inline-block";
  disableControls();

  switch (algo) {
    case "bubble":
      await bubbleSort();
      break;
    case "insertion":
      await insertionSort();
      break;
    case "selection":
      await selectionSort();
      break;
    case "merge":
      await mergeSort(0, array.length - 1);
      break;
  }

  playSuccess();
  showCompleteMessage();
  enableControls();
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseResumeBtn").textContent = isPaused ? "Resume" : "Pause";
}

function disableControls() {
  document.getElementById("generate").disabled = true;
  document.getElementById("visualize").disabled = true;
  document.getElementById("arrayInput").disabled = true;
  document.getElementById("algorithmSelect").disabled = true;
  document.getElementById("speedRange").disabled = true;
}
function enableControls() {
  document.getElementById("generate").disabled = false;
  document.getElementById("visualize").disabled = false;
  document.getElementById("arrayInput").disabled = false;
  document.getElementById("algorithmSelect").disabled = false;
  document.getElementById("speedRange").disabled = false;
}

function updateBarLabel(bar, newValue) {
  bar.style.height = `${getNormalizedHeight(newValue)}px`;
  bar.querySelector('.bar-value').innerText = newValue;
}

async function bubbleSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < bars.length - 1; i++) {
    passes++; updatePassCounter();
    for (let j = 0; j < bars.length - i - 1; j++) {
      bars[j].style.backgroundColor = "red";
      bars[j + 1].style.backgroundColor = "red";
      await sleep(speed);
      steps++; updateStepCounter(); playTick();

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateBarLabel(bars[j], array[j]);
        updateBarLabel(bars[j + 1], array[j + 1]);
        updateArrayDisplay();
      }

      bars[j].style.backgroundColor = "#3498db";
      bars[j + 1].style.backgroundColor = "#3498db";
    }
    bars[bars.length - i - 1].style.backgroundColor = "green";
  }
  bars[0].style.backgroundColor = "green";
}

async function insertionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < bars.length; i++) {
    passes++; updatePassCounter();
    let key = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = "red";
    await sleep(speed);
    steps++; updateStepCounter(); playTick();

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      updateBarLabel(bars[j + 1], array[j + 1]);
      j--;
      updateArrayDisplay();
      steps++; updateStepCounter(); playTick();
      await sleep(speed);
    }

    array[j + 1] = key;
    updateBarLabel(bars[j + 1], key);
    updateArrayDisplay();

    for (let k = 0; k <= i; k++) {
      bars[k].style.backgroundColor = "green";
    }
  }
}

async function selectionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < bars.length; i++) {
    passes++; updatePassCounter();
    let minIdx = i;
    bars[minIdx].style.backgroundColor = "red";
    for (let j = i + 1; j < bars.length; j++) {
      bars[j].style.backgroundColor = "orange";
      await sleep(speed);
      steps++; updateStepCounter(); playTick();

      if (array[j] < array[minIdx]) {
        bars[minIdx].style.backgroundColor = "#3498db";
        minIdx = j;
        bars[minIdx].style.backgroundColor = "red";
      } else {
        bars[j].style.backgroundColor = "#3498db";
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      updateBarLabel(bars[i], array[i]);
      updateBarLabel(bars[minIdx], array[minIdx]);
      updateArrayDisplay();
    }

    bars[i].style.backgroundColor = "green";
  }
}

async function mergeSort(start, end) {
  if (start >= end) return;
  passes++; updatePassCounter();
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const bars = document.getElementsByClassName("bar");
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);

  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    bars[k].style.backgroundColor = "red";
    await sleep(speed);
    steps++; updateStepCounter(); playTick();

    if (left[i] <= right[j]) {
      array[k] = left[i];
      updateBarLabel(bars[k], left[i]);
      i++;
    } else {
      array[k] = right[j];
      updateBarLabel(bars[k], right[j]);
      j++;
    }
    k++;
    updateArrayDisplay();
  }

  while (i < left.length) {
    bars[k].style.backgroundColor = "red";
    await sleep(speed);
    steps++; updateStepCounter(); playTick();
    array[k] = left[i];
    updateBarLabel(bars[k], left[i]);
    i++; k++;
    updateArrayDisplay();
  }

  while (j < right.length) {
    bars[k].style.backgroundColor = "red";
    await sleep(speed);
    steps++; updateStepCounter(); playTick();
    array[k] = right[j];
    updateBarLabel(bars[k], right[j]);
    j++; k++;
    updateArrayDisplay();
  }

  for (let m = start; m <= end; m++) {
    bars[m].style.backgroundColor = "green";
  }
}

generateArray();
