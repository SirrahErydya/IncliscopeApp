var canvas = document.getElementById('galaxy-canvas'),
    canvas_ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height,
    x1,                 /// start points
    y1,
    cX = canvas.width / 2,                 /// center points
    cY = canvas.height / 2,
    isDown = false,     /// if mouse button is down
    sma,                        /// semi major axis
    smi;                        /// semi minor axis

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

const widthSlider = document.querySelector('#width');
const heightSlider = document.querySelector('#height');
const ellipseWidth = document.querySelector('#width-value');
const ellipseHeight = document.querySelector('#height-value');
widthSlider.value = w;
heightSlider.value = h;
ellipseWidth.textContent = widthSlider.value;
ellipseHeight.textContent = heightSlider.value;


function drawEllipse(radX, radY) {
    canvas_ctx.clearRect(0, 0, w, h);
    var step = 0.01,                 /// resolution of ellipse
        a = step,                    /// counter
        pi2 = Math.PI * 2 - step;    /// end angle
    /// start a new path
    canvas_ctx.beginPath();

    /// set start point at angle 0
    canvas_ctx.moveTo(cX + radX * Math.cos(0),
               cY + radY * Math.sin(0));

    /// create the ellipse
    for(; a < pi2; a += step) {
        canvas_ctx.lineTo(cX + radX * Math.cos(a),
                   cY + radY * Math.sin(a));
    }

    /// close it and stroke it for demo
    canvas_ctx.closePath();
    canvas_ctx.strokeStyle = 'yellow';
    canvas_ctx.stroke();

    if(radX < radY) {
        sma = radY;
        smi = radX;
    } else {
        sma = radX;
        smi = radY;
    }
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

//drawEllipseFromRectangle(0,0,w,h);
