const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clear-btn");
const colorPicker = document.getElementById("color-picker");
const shapeSelector = document.getElementById("shape-selector");
const penSize = document.getElementById("pen-size");
let shapeStarted = false;
let startX, startY; // Variables to store initial position of the shape

let painting = false;
let currentColor = colorPicker.value;
let currentShape = shapeSelector.value;
let currentSize = penSize.value;

ctx.lineWidth = currentSize;
ctx.lineCap = "round";
ctx.strokeStyle = currentColor;

function startPosition(e) {
  painting = true;
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  const rect = canvas.getBoundingClientRect();
  let clientX, clientY;

  if (e.touches && e.touches[0]) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  if (!painting) return;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentSize;

  if (currentShape === "line") {
    // Drawing lines on touchmove (as before)
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  } else if (currentShape === "circle" && shapeStarted) {
    // Drawing circles when shapeStarted is true (on touchmove)
    const radius = Math.sqrt(
      Math.pow(clientX - rect.left - startX, 2) +
        Math.pow(clientY - rect.top - startY, 2)
    );
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (currentShape === "rectangle" && shapeStarted) {
    // Drawing rectangles when shapeStarted is true (on touchmove)
    const width = clientX - rect.left - startX;
    const height = clientY - rect.top - startY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.stroke();
  }
}

canvas.addEventListener("touchstart", (e) => {
  const rect = canvas.getBoundingClientRect();
  shapeStarted = true;
  startX = e.touches[0].clientX - rect.left;
  startY = e.touches[0].clientY - rect.top;
});

canvas.addEventListener("touchend", (e) => {
  shapeStarted = false;
  draw(e);
  ctx.beginPath();
});

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  shapeStarted = true;
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
});

canvas.addEventListener("mouseup", (e) => {
  shapeStarted = false;
  draw(e);
  ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

colorPicker.addEventListener("input", () => {
  currentColor = colorPicker.value;
});

shapeSelector.addEventListener("change", () => {
  currentShape = shapeSelector.value;
});

penSize.addEventListener("input", () => {
  currentSize = penSize.value;
});

clearBtn.addEventListener("click", clearCanvas);
