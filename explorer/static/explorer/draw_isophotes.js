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

    /// clear canvas
    ctx.clearRect(0, 0, w, h);

    /// draw ellipse
    drawEllipseFromRectangle(x1, y1, x2, y2);

}

drawEllipseFromRectangle(0,0,w,h);