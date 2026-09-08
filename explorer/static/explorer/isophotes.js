var canvas = document.getElementById('galaxy-canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height,
    x1,                 /// start points
    y1,
    cX,                 /// center points
    cY,
    isDown = false,     /// if mouse button is down
    sma,                        /// semi major axis
    smi;                        /// semi minor axis

/// handle mouse down
canvas.onmousedown = function(e) {

    /// get corrected mouse position and store as first point
    var rect = canvas.getBoundingClientRect();
    x1 = e.clientX - rect.left;
    y1 = e.clientY - rect.top;
    isDown = true;
}

/// clear isDown flag to stop drawing
canvas.onmouseup = function() {
    isDown = false;
}

/// draw ellipse from start point
canvas.onmousemove = function(e) {

    if (!isDown) return;

    var rect = canvas.getBoundingClientRect(),
        x2 = e.clientX - rect.left,
        y2 = e.clientY - rect.top;

    /// clear canvas
    ctx.clearRect(0, 0, w, h);

    /// draw ellipse
    drawEllipseFromRectangle(x1, y1, x2, y2);

}

// UI functionalities
const iValue = document.querySelector("#inclination-value");
const q0value = document.querySelector("#q0-value");
const q0input = document.querySelector("#q0");
const toggleButton = document.querySelector('#toggle-button');
const gtSpan = document.querySelector('#gt');

q0value.textContent = q0input.value;
q0input.addEventListener("input", (event) => {
  q0value.textContent = event.target.value;
  calculateInclination();
});
toggleButton.onclick = toggleGroundTruth;

drawEllipseFromRectangle(0,0,w,h);

const widthSlider = document.querySelector('#width');
const heightSlider = document.querySelector('#height');
const ellipseWidth = document.querySelector('#width-value');
const ellipseHeight = document.querySelector('#height-value');
widthSlider.value = w;
heightSlider.value = h;
ellipseWidth.textContent = widthSlider.value;
ellipseHeight.textContent = heightSlider.value;

widthSlider.addEventListener("input", (event) => {
  ellipseWidth.textContent = event.target.value;
  drawEllipseFromSlider();
});

heightSlider.addEventListener("input", (event) => {
  ellipseHeight.textContent = event.target.value;
  drawEllipseFromSlider();
});

function drawEllipseFromSlider() {
    ctx.clearRect(0, 0, w, h);
    eW = widthSlider.value;
    eH = heightSlider.value;
    drawEllipse(eW, eH);
}

function drawEllipseFromRectangle(x1, y1, x2, y2) {
    var radiusX = (x2 - x1) * 0.5,   /// radius for x based on input
        radiusY = (y2 - y1) * 0.5,   /// radius for y based on input
        centerX = x1 + radiusX,      /// calc center
        centerY = y1 + radiusY

    cX = centerX;
    cY = centerY
    drawEllipse(radiusX, radiusY);
    console.log(x1 + " " + y1)

}

function drawEllipse(radX, radY) {
    var step = 0.01,                 /// resolution of ellipse
        a = step,                    /// counter
        pi2 = Math.PI * 2 - step;    /// end angle
    /// start a new path
    ctx.beginPath();

    /// set start point at angle 0
    ctx.moveTo(cX + radX * Math.cos(0),
               cY + radY * Math.sin(0));

    /// create the ellipse
    for(; a < pi2; a += step) {
        ctx.lineTo(cX + radX * Math.cos(a),
                   cY + radY * Math.sin(a));
    }

    /// close it and stroke it for demo
    ctx.closePath();
    ctx.strokeStyle = 'yellow';
    ctx.stroke();

    if(radX < radY) {
        sma = radY;
        smi = radX;
    } else {
        sma = radX;
        smi = radY;
    }

    calculateInclination();
}

function calculateInclination() {
    var i = Math.acos(Math.sqrt( ((smi/sma)**2 - q0input.value**2) / (1 - q0input.value**2) ));
    i = (i * 180) / Math.PI;
    if(Number.isNaN(i)) {
        i = 90.00;
    }
    iValue.textContent = i.toFixed(2) + '';
    console.log(i);
}

function toggleGroundTruth() {
    if (gtSpan.style.display === "none") {
        gtSpan.style.display = "inline-block";
        toggleButton.classList.remove('button');
        toggleButton.classList.add('button-active');
    } else {
        gtSpan.style.display = "none";
        toggleButton.classList.remove('button-active');
        toggleButton.classList.add('button');
    }
}
