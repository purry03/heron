const myFont = new FontFace('input-mono-medium', 'url(./InputMono-Medium.ttf)');

myFont.load().then((font) => {
    document.fonts.add(font);

    console.log('Font loaded');
});

var el = document.getElementById("main-canvas");
var ctx = el.getContext('2d')


var canvas_height = ($("body").height() * 0.90) - 30;
var canvas_width = $("body").width() - 30;

$("#main-canvas").attr("width", canvas_width);
$("#main-canvas").attr("height", canvas_height);



var glyps = {
    dot: ".",
    plus: "+",
    cursor: "@"
};

var dim = {
    x: 129,
    y: 41
}

var cursor = {
    x: 10,
    y: 10
}

document.onkeydown = function (e) {
    switch (e.which) {
        case 37: // left
            cursor.x -= 1;
            if (cursor.x < 0) {
                cursor.x = dim.x - 1;
            }
            break;

        case 38: // up
            cursor.y -= 1;
            if (cursor.y < 0) {
                cursor.y = dim.y - 1;
            }
            break;

        case 39: // right
            cursor.x += 1;
            if (cursor.x >= dim.x) {
                cursor.x = 0;
            }
            break;

        case 40: // down
            cursor.y += 1;
            if (cursor.y >= dim.y) {
                cursor.y = 0;
            }
            break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};

$('#main-canvas').click(function (e) { //Relative ( to its parent) mouse position 
    var elm = $("#main-canvas");
    var xPos = e.pageX - elm.offset().left;
    var yPos = e.pageY - elm.offset().top;
    cursor.x = Math.floor(scale(xPos, 0, elm.width(), 0, dim.x));
    cursor.y = Math.floor(scale(yPos, 0, elm.height(), 0, dim.y));
});

function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

setInterval(() => {
    ctx.clearRect(0, 0, el.width, el.height);
    update();
}, (1000 / 50));

function update() {
    for (let y = 0; y <= dim.y; y++) {
        for (let x = 0; x <= dim.x; x++) {
            ctx.font = "11.25px input-mono-medium";
            ctx.fillStyle = "#eeeeee";
            ctx.textAlign = "center";
            ctx.globalAlpha = 0.4;
            if (x == cursor.x && y == cursor.y) {
                drawCursor(x, y);
            }
            else {
                if (x % 4 == 0 && y % 4 == 0) {
                    drawText(glyps.plus, x * (canvas_width / dim.x), y * (canvas_height / dim.y))
                }
                else {
                    if (isVisible(x, y)) {
                        drawText(glyps.dot, x * (canvas_width / dim.x), y * (canvas_height / dim.y))
                    }
                }
            }
        }
    }
}

function drawText(g, x, y) {
    ctx.fillText(g, x + 6, y + 13)
}

function drawCursor(x, y) {
    ctx.fillStyle = "orange";
    ctx.globalAlpha = 1.0;
    ctx.fillRect(x * (canvas_width / dim.x) + 1, y * (canvas_height / dim.y) + 1, 11.25, 17);
    ctx.fillStyle = "black";
    drawText(glyps.cursor, x * (canvas_width / dim.x), y * (canvas_height / dim.y))
}


function isVisible(x, y) {
    var start_x = Math.floor(cursor.x / 4);
    var start_y = Math.floor(cursor.y / 4);

    if (x >= (start_x * 4) && x <= (start_x * 4 + 4)) {
        if (y >= (start_y * 4) && y <= (start_y * 4 + 4)) {
            return true;
        }
    }
    return false;
}