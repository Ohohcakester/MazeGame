// REGION - MAZES - START

/*var maze = [
'1 1 1 1 1 1 1 1 1 1',
'1 P 0 0 0 0 D4 0 0 1',
'1 0 0 S1 0 0 D3 0 0 1',
'1 0 0 S2 0 0 d2 0 0 1',
'1 0 0 0 0 0 D1 0 G 1',
'1 1 1 1 1 1 1 1 1 1',
].join('\n')*/

var maze = [
'1 1  1  1  1 1  1  1  1 1  1  1  1 1  1  1  1 1  1  1  1 1  1  1  1 1  1  1  1 1  1',
'1 S1 0  0  1 S1 S2 0  1 S1 S2 S3 1 S1 S2 S3 1 S1 S2 S3 1 S1 S2 S3 1 S1 S2 S3 1 G  1',
'1 0  0  0  1 0  0  0  1 0  0  0  1 S4 0  0  1 S4 S5 0  1 S4 S5 S6 1 S4 S5 S6 1 0  1',
'1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 S7 0  0  1 0  1',
'1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  1',
'1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 d1 1  D1 1 D1 1',
'1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 d1 1  D1 1 d2 1  D2 1 D2 1',
'1 0  0  0  1 0  0  0  1 0  0  0  1 0  0  0  1 d1 1  D1 1 d2 1  D2 1 d3 1  D3 1 D3 1',
'1 0  0  0  1 0  0  0  1 0  0  0  1 d1 1  D1 1 d2 1  D2 1 d3 1  D3 1 d4 1  D4 1 D4 1',
'1 0  0  0  1 0  0  0  1 d1 1  D1 1 d2 1  D2 1 d3 1  D3 1 d4 1  D4 1 d5 1  D5 1 D5 1',
'1 0  0  0  1 d1 1  D1 1 d2 1  D2 1 d3 1  D3 1 d4 1  D4 1 d5 1  D5 1 d6 1  D6 1 D6 1',
'1 D1 1  d1 1 D2 1  d2 1 D3 1  d3 1 D4 1  d4 1 D5 1  d5 1 D6 1  d6 1 D7 1  d7 1 D7 1',
'1 P  0  0  0 0  0  0  0 0  0  0  0 0  0  0  0 0  0  0  0 0  0  0  0 0  0  0  0 0  1',
'1 1  1  1  1 1  1  1  1 1  1  1  1 1  1  1  1 1  1  1  1 1  1  1  1 1  1  1  1 1  1',
].join('\n')


var colours = [
'#ff0000',
'#00ff00',
'#0000ff',
'#ffff00',
'#00ffff',
'#ff00ff',
'#ff8000',
'#ff0080',
'#80ff00',
'#8000ff',
'#00ff80',
'#0080ff',
'#ff8080',
'#ff8080',
'#80ff80',
'#80ffff',
'#ffff80',
'#ff80ff',
]


// REGION - MAZES - END

// REGION - HTML5 CANVAS BOILERPLATE - START
var width = 600;
var height = 500;
var gLoop;

// Initialisation
var mainCanvas = document.getElementById('mainCanvas');
var canvasRect = mainCanvas.getBoundingClientRect();
var ctx = mainCanvas.getContext('2d');

var win = document.getElementById('window');
window.addEventListener("keydown", keyboardPress, false);
window.addEventListener("keyup", keyboardRelease, false);
window.addEventListener("click", mouseClick, false);

mainCanvas.width = width;
mainCanvas.height = height;

mainCanvas.onmousedown = function(){
  return false;
};

// REGION - HTML5 CANVAS BOILERPLATE - END

var item_switch = 'S';
var item_blocked = 'B';
var item_door_closed = 'D';
var item_door_open = 'd';
var item_goal = 'G';

var tiles = undefined
var sizeX = -1;
var sizeY = -1;

var playerY;
var playerX;

var tileSize = -1;

var gameOver = false;

var Item = function(type,id,x,y) {
    this.type = type;
    this.id = id;
    this.x = x;
    this.y = y;
}

//REGION - SPAWNING - START
function spawn_block(x,y) {
    tiles[y][x] = new Item(item_blocked, -1, x, y);
}
function spawn_opendoor(x,y,id) {
    tiles[y][x] = new Item(item_door_open, id, x, y);
}
function spawn_closeddoor(x,y,id) {
    tiles[y][x] = new Item(item_door_closed, id, x, y);
}
function spawn_switch(x,y,id) {
    tiles[y][x] = new Item(item_switch, id, x, y);
}
function spawn_goal(x,y) {
    tiles[y][x] = new Item(item_goal, -1, x, y);
}

function spawnItem(token, x, y) {
    var tokenl = token.toLowerCase();
    if (tokenl === 'x' || tokenl === '1') {
        spawn_block(x,y);
    } else if (tokenl[0] === 's') {
        var id = +tokenl.substring(1)
        spawn_switch(x,y,id);
    } else if (token[0] === 'D') {
        var id = +tokenl.substring(1)
        spawn_closeddoor(x,y,id);
    } else if (token[0] === 'd') {
        var id = +tokenl.substring(1)
        spawn_opendoor(x,y,id);
    } else if (tokenl === 'p') {
        playerY = y;
        playerX = x;
    } else if (tokenl === 'g') {
        spawn_goal(x,y);
    }
}

function isType(tile, type) {
    if (tile === undefined) return false;
    return (tile.type === type);
}

function isBlocked(x,y) {
    if (y < 0 || x < 0 || y >= sizeY || x >= sizeX) return true;
    var tile = tiles[y][x];
    if (tile === undefined) return false;
    return (tile.type === item_blocked || tile.type === item_door_closed);
}

function drawRect(colour, x, y, sizeX, sizeY) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.rect(x,y,sizeX,sizeY);
    ctx.closePath();
    ctx.fill();
}

function drawCRect(colour, cx, cy, sizex, sizey) {
    drawRect(colour, cx - sizex/2, cy - sizey/2, sizex, sizey);
}

function drawTile(tile, size, x, y) {
    if (tile === undefined) return;
    if (tile.type === item_blocked) {
        drawRect('#404040',x,y,size,size);
        return;
    } else if (tile.type === item_switch) {
        var linethickness = size/8;
        var p1 = size*1/3 - linethickness/2;
        var p2 = size*2/3 - linethickness/2;
        
        var colour = colours[tile.id];
        drawRect(colour, x+p1,y,linethickness,size);
        drawRect(colour, x+p2,y,linethickness,size);
        drawRect(colour, x,y+p1,size,linethickness);
        drawRect(colour, x,y+p2,size,linethickness);
        return;
    } else if (tile.type === item_door_closed) {
        drawRect(colours[tile.id],x,y,size,size);
        return;
    } else if (tile.type === item_door_open) {
        var csize = size/4;
    
        drawRect(colours[tile.id],x,y,csize,csize);
        drawRect(colours[tile.id],x,y+size-csize,csize,csize);
        drawRect(colours[tile.id],x+size-csize,y,csize,csize);
        drawRect(colours[tile.id],x+size-csize,y+size-csize,csize,csize);
        return;
    } else if (tile.type === item_goal) {
        var cx = x + size/2;
        var cy = y + size/2;
        var size0 = size/4;
        var size1 = size*2/4;
        var size2 = size*3/4;
    
        drawCRect('#ffff00',cx,cy,size,size);
        drawCRect('#ffffff',cx,cy,size2,size2);
        drawCRect('#ffff00',cx,cy,size1,size1);
        drawCRect('#ffffff',cx,cy,size0,size0);
        return;
    }
}

function flipSwitch(x,y) {
    var tile = tiles[y][x];
    if (!isType(tile, item_switch)) return false;
    var id = tile.id;
    console.log("Flip " + id);
    for (var j=0;j<sizeY;++j) {
        for (var i=0;i<sizeX;++i) {
            tile = tiles[j][i];
            if (isType(tile, item_door_open) && tile.id === id) {
                tile.type = item_door_closed;
            } else if (isType(tile, item_door_closed) && tile.id === id) {
                tile.type = item_door_open;
            }
        }
    }
    return true;
}

//REGION - SPAWNING - END


function initGame() {
    gameOver = false;
    rows = maze.split('\n');
    sizeY = rows.length;
    sizeX = rows[0].split(/\s+/).length;

    tiles = []
    for (var y=0;y<sizeY;++y) {
        row = [];
        for (var x=0;x<sizeX;++x) {
            row.push(undefined);
        }
        tiles.push(row);
    }
    
    for (var y=0;y<sizeY;++y) {
        cols = rows[y].split(/\s+/);
        for (var x=0;x<sizeX;++x) {
            spawnItem(cols[x], x, y);
        }
    }
    
    tileSize = Math.min(Math.floor(width/sizeX), Math.floor(height/sizeY));
    redraw();
}

function winGame() {
    gameOver = true;
    console.log("YOU WON");
}

function withinScreen(relX, relY) {
    return relX >= 0 && relY >= 0 && relX <= width && relY <= height;
}

function mouseClick(e) {
    var mouseX = e.clientX - canvasRect.left;
    var mouseY = e.clientY - canvasRect.top;
    if (!withinScreen(mouseX, mouseY)) return;
}

function keyboardRelease(e) {
    return;
    keyPressed[getKeyIndex(e)] = false;
}

function afterMove() {
    if (isType(tiles[playerY][playerX], item_goal)) {
        winGame();
    }
}

function keyboardPress(e) {
    if (gameOver) return;
    //console.log(e.keyCode);
    switch(e.keyCode) {
        case 38: // Up
            if (!isBlocked(playerX, playerY-1)) {
                playerY--;
                afterMove();
            }
            break;
        case 40: // Down
            if (!isBlocked(playerX, playerY+1)) {
                playerY++;
                afterMove();
            }
            break;
        case 37: // Left
            if (!isBlocked(playerX-1, playerY)) {
                playerX--;
                afterMove();
            }
            break;
        case 39: // Right
            if (!isBlocked(playerX+1, playerY)) {
                playerX++;
                afterMove();
            }
            break;
        case 32: // SPACE
        case 90: // Z
            flipSwitch(playerX,playerY);
            break;
    }
    redraw();
}

function keyboardUpdate() {
    for (i=0;i<keyClicked.length;i++) {
        if (keyClicked[i]) {
            var flash = spawnCircle(i, 1, 2.5);
            keyFlash[i] = flash;
        }
        
        if (keyPressed[i]) {
            if (keyFlash[i] != null) {
                keyFlash[i].resetFrame();
            }
        } else {
            keyFlash[i] = null;
        }
        
        keyClicked[i] = false;
    }
}

function updateFrame(){
}

function drawFrame(){
    drawBackground();
}

function drawPlayer() {
    var radius = tileSize/3;
    var colour = '#ffc0c0';
    if (gameOver) {
        radius = tileSize/3.5;
        colour = '#ffa000';
    }
    cx = tileSize * (playerX+0.5);
    cy = tileSize * (playerY+0.5);
    
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(cx,cy, radius, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();
}

function drawBackground(){
    if (tiles == undefined) return;

    thickness = 1;
    tileDrawSize = tileSize - 2*thickness;
    for (var y=0;y<sizeY;++y) {
        for (var x=0;x<sizeX;++x) {
            offsetX = tileSize * x + thickness;
            offsetY = tileSize * y + thickness;
            
            ctx.fillStyle = '#808080';
            ctx.beginPath();
            ctx.rect(offsetX,offsetY,tileDrawSize,tileDrawSize);
            ctx.closePath();
            ctx.fill();
            
            drawTile(tiles[y][x], tileDrawSize, offsetX, offsetY);
        }
    }
    
    drawPlayer();
}

function clearScreen(){
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
};

function redraw() {
    clearScreen();
    drawFrame();
}

function gameLoop(time){
    updateFrame();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();