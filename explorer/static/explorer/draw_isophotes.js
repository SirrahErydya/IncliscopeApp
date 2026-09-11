// Canvas Drawing for Isophotes

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


    /// draw ellipse
    drawEllipseFromRectangle(x1, y1, x2, y2);

}

widthSlider.addEventListener("input", (event) => {
  ellipseWidth.textContent = event.target.value;
  drawEllipseFromSlider();
});

heightSlider.addEventListener("input", (event) => {
  ellipseHeight.textContent = event.target.value;
  drawEllipseFromSlider();
});

// Calculate the inclination based on SMI and SMA
function calculateInclination() {
    var i = Math.acos(Math.sqrt( ((smi/sma)**2 - q0input.value**2) / (1 - q0input.value**2) ));
    i = (i * 180) / Math.PI;
    if(Number.isNaN(i)) {
        i = 90.00;
    }
    iValue.textContent = i.toFixed(2) + '';
}

drawEllipseFromRectangle(0,0,w,h);

function drawEllipseFromSlider() {
    eW = widthSlider.value;
    eH = heightSlider.value;
    drawEllipse(eW, eH);
    calculateInclination();
}

function drawEllipseFromRectangle(x1, y1, x2, y2) {
    var radiusX = (x2 - x1) * 0.5,   /// radius for x based on input
        radiusY = (y2 - y1) * 0.5,   /// radius for y based on input
        centerX = x1 + radiusX,      /// calc center
        centerY = y1 + radiusY

    cX = centerX;
    cY = centerY
    drawEllipse(radiusX, radiusY);
    calculateInclination();

}