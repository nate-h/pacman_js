//////////////////////////////////////////////////////////////////////////////
// PACMAN V.2
// Created by Nathanial Hapeman
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// Vars
//////////////////////////////////////////////////////////////////////////////

var s = {
    rows: 13,
    cols: 20,
    width: 30,
    height: 30,
    shiftX: 0,
    shiftY: 0,
    score: 0
};

var startReset = {
    w: 80,
    h: 30,
    x: 5,
    y: 395,
    start: true
};

var clock = {
    time: 0,
    x: 440,
    y: 399,
    h: 30,
    w: 80,
    id: 0
};

// images
var smallBG = new Image();
smallBG.src = 'img/smallBG.png';
var spacePic = new Image();
spacePic.src = 'img/space.png';
var foodPic = new Image();
foodPic.src = 'img/food2.png';
var resetPic = new Image();
resetPic.src = 'img/reset.png';
var startPic = new Image();
startPic.src = 'img/start.png';
var clockPic = new Image();
clockPic.src = 'img/clockPac.png';
var bg = new Image();
bg.src = 'img/pacmanBG.png';
var powerUpPic = new Image();
powerUpPic.src = 'img/powerUp.png';
var gameOverPic = new Image();
gameOverPic.src = 'img/gameOver.png';

// sound effects
var pressB = new Audio('sounds/pressB.wav');
var tada = new Audio('sounds/tada.wav');
var introSound = new Audio('sounds/startUpPacman.wav');
var chompSound = new Audio('sounds/pacman_chomp.wav');
var deathSound = new Audio('sounds/pacman_death.wav');
var eatGhostSound = new Audio('sounds/pacman_eatghost.wav');
var bgMusic = new Audio('sounds/bgMusic.mp3');
var teleportSound = new Audio('sounds/teleport.wav');
var powerUpSound = new Audio('sounds/powerUp.wav');

// vars
var picChanges = [];
var picChangesSize = 5;
var c;
var mX;
var mY;
var clickedX;
var clickedY;
var canvas;
var canvasH;
var canvasW;
var mapW = s.cols * s.width;
var mapH = s.rows * s.height;
var rState = 1;
var mainId;
var foodCount = 119;
var lastState = 3;
var moveState = 3;
var nextState = 3;
var picState = 12;
var toggle = true;
var vel = 0.125;
var velG = 0.125;
var xt1;
var xt2;
var xt3;
var xt4;
var yt1;
var yt2;
var yt3;
var yt4;

//////////////////////////////////////////////////////////////////////////////
// Setting Up Level
//////////////////////////////////////////////////////////////////////////////

// LEVEL KEY
// -1 eaten food
// 0 wall
// 1 food
// 2 power ups
// 3 black hole
// 4 space
var level = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 3, -1, -1, -1],
    [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
    [-1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, -1],
    [-1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, -1],
    [3, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, -1],
    [-1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, -1],
    [-1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, -1],
    [-1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1],
    [-1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, -1],
    [-1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, -1],
    [-1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, -1],
    [-1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, -1],
    [-1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1],
    [-1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, -1],
    [-1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, -1],
    [-1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 3],
    [-1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, -1],
    [-1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, -1],
    [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
    [-1, -1, -1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];

function Point (x, y) {
    this.x = x;
    this.y = y;
}

//////////////////////////////////////////////////////////////////////////////
// Sorted Set
//////////////////////////////////////////////////////////////////////////////

function SortedSet () {
    this._length = 0;
    this._head = null;
}

SortedSet.prototype.add = function (loc) {
    // increment count
    this._length++;

    // create a new node, place data in
    var node = {
        loc: loc,
        next: null
    }; var current; var temp;

    // special case: no items in the list yet
    if (this._head === null) {
        this._head = node;
    } else {
        current = this._head;

        // dont add duplicate
        if (node.loc == this._head.loc) {
            this._length--;
            return;
        }

        // see if replace head
        if (node.loc > this._head.loc) {
            temp = this._head;
            this._head = node;
            node.next = temp;
            return;
        }

        // see if its next node after head
        if (current.next === null) {
            current.next = node;
            return;
        }
        temp = current;
        current = current.next;

        while (current.next) {
            if (node.loc == current.loc) {
                this._length--;
                return;
            }

            if (node.loc > current.loc) {
                temp.next = node;
                node.next = current;
                return;
            }

            temp = temp.next;
            current = current.next;
        }

        // gets here if tail
        if (node.loc == current.loc) {
            this._length--;
            return;
        }
        if (node.loc > current.loc) {
            temp.next = node;
            node.next = current;
            return;
        }
        current.next = node;
    }
};

SortedSet.prototype.item = function (index) {
    // check if num is valid
    if (index > -1 && index < this._length) {
        var current = this._head;
        var i = 0;

        while (i++ < index) {
            current = current.next;
        }

        return current.loc;
    } else {
        return null;
    }
};

SortedSet.prototype.print = function () {
    var current = this._head;

    if (this._head === null) {
        console.log('empty set');
        return;
    }
    while (current.next) {
        console.log('loc: ', current.loc);
        current = current.next;
    }
    console.log('loc: ', current.loc);
};

SortedSet.prototype.remove = function (index) { // change to loc
    // check for out-of-bounds values
    if (index > -1 && index < this._length) {
        var current = this._head;
        var previous;
        var i = 0;

        // special case: removing first item
        if (index === 0) {
            this._head = current.next;
        } else {
            // find the right location
            while (i++ < index) {
                previous = current;
                current = current.next;
            }

            // skip over the item to remove
            previous.next = current.next;
        }

        // decrement the length
        this._length--;

        // return the value
        return current.data;
    } else {
        return null;
    }
};


//////////////////////////////////////////////////////////////////////////////
// Setting Up Dijkstra's Algorithm
//////////////////////////////////////////////////////////////////////////////

// used for constant lookup time access
var vertLevel = [];
// stores vertexes
var vertices = [];
var vertexCount = 0;

// nodes holds the information of where the direction
// could change in the map
function Node (x, y, loc) {
    this.x = x;
    this.y = y;
    this.loc = loc;
    this.value = 0;
    this.edge1 = 0;
    this.edge2 = 0;
    this.edge3 = 0;
    this.edge4 = 0;
    this.n1 = -1;
    this.n2 = -1;
    this.n3 = -1;
    this.n4 = -1;
    this.visited = false;
    this.parent = -1;
}

// populate array with zeros
for (var i = 0; i < s.cols; i++) {
    vertLevel[i] = new Array(s.rows);
}
for (var i = 0; i < s.cols; i++) {
    for (var j = 0; j < s.rows; j++) {
        vertLevel[i][j] = -1;
    }
}

// test if point is a vertex
function testVar (i, j) {
    if (level[i][j] == 1) {
        if (level[i][j + 1] == 1 || level[i][j - 1] == 1) {
            if (level[i + 1][j] == 1 || level[i - 1][j] == 1) { return true; }
        }
    }
    return false;
}
// iterate through vertexes to test
for (var i = 1; i < s.cols - 1; i++) {
    for (var j = 1; j < s.rows - 1; j++) {
        if (testVar(i, j)) {
            vertLevel[i][j] = vertexCount;
            vertices.push(new Node(i, j, vertexCount));
            vertexCount++;
        }
    }
}

// finding the location of the neignoring nodes
// relative to each node
for (var i = 0; i < vertexCount; i++) {
    var n = vertices[i];
    var x = n.x;
    var y = n.y;
    // Going left.
    while (true) {
        x--;
        if (x < 0) { break; }
        if (level[x][y] != 1) { break; }
        n.edge1++;
        if (vertLevel[x][y] != -1) { break; }
    }
    x = n.x;
    // Going up.
    while (true) {
        y--;
        if (y < 0) { break; }
        if (level[x][y] != 1) { break; }
        n.edge2++;
        if (vertLevel[x][y] != -1) { break; }
    }
    y = n.y;
    // Going right.
    while (true) {
        x++;
        if (x > s.cols - 1) { break; }
        if (level[x][y] != 1) { break; }
        n.edge3++;
        if (vertLevel[x][y] != -1) { break; }
    }
    x = n.x;
    // Going down.
    while (true) {
        y++;
        if (y > s.rows - 1) { break; }
        if (level[x][y] != 1) { break; }
        n.edge4++;
        if (vertLevel[x][y] != -1) { break; }
    }
}

// Now to find neighbors.
for (var i = 0; i < vertexCount; i++) {
    var n = vertices[i];
    var x = n.x;
    var y = n.y;

    // find n1
    if (n.edge1 == 0) {
        n.n1 = -1;
    } else {
        n.n1 = vertLevel[n.x - n.edge1][n.y];
    }
    // find n2
    if (n.edge2 == 0) {
        n.n2 = -1;
    } else {
        n.n2 = vertLevel[n.x][n.y - n.edge2];
    }
    // find n3
    if (n.edge3 == 0) {
        n.n3 = -1;
    } else {
        n.n3 = vertLevel[n.x + n.edge3][n.y];
    }
    // find n4
    if (n.edge4 == 0) {
        n.n4 = -1;
    } else {
        n.n4 = vertLevel[n.x][n.y + n.edge4];
    }
}

// used for dijkstras algorithm
function resetVertices () {
    for (var i = 0; i < vertexCount; i++) {
        vertices[i].visited = false;
        vertices[i].value = 10000;
        vertices[i].parent = -1;
    }
}

// hack to reduce if/else statements in dijkstra's
// power ups
level[4][9] = 2;
level[15][3] = 2;
level[13][7] = 2;
level[6][5] = 2;


//////////////////////////////////////////////////////////////////////////////
// Pacman Class Declaration
//////////////////////////////////////////////////////////////////////////////

function Pacman (xIn, yIn) {
    // public
    this.x = xIn;
    this.y = yIn;
    this.w = 30;
    this.h = 30;
    this.direction = 3;
    this.attackTimer = 0;

    // private

    var lives = 3;
    var startX = xIn;
    var startY = yIn;
    var alive = true;
    // used for regular movement
    var pic1 = new Image();
    pic1.src = 'img/pacman1.png';
    var pic2 = new Image();
    pic2.src = 'img/pacman2.png';
    var pic3 = new Image();
    pic3.src = 'img/pacman3.png';
    var pic4 = new Image();
    pic4.src = 'img/pacman4.png';
    // used for power ups
    var pic1s = new Image();
    pic1s.src = 'img/pacman1s.png';
    var pic2s = new Image();
    pic2s.src = 'img/pacman2s.png';
    var pic3s = new Image();
    pic3s.src = 'img/pacman3s.png';
    var pic4s = new Image();
    pic4s.src = 'img/pacman4s.png';
    // live indicator
    var miniPacman = new Image();
    miniPacman.src = 'img/miniPacman.png';

    // functions

    // if pacman dies
    this.die = function () {
    // reset ghost
        redG.reset();
        pinkG.reset();
        blueG.reset();
        orangeG.reset();
        deathSound.play();
        lives--;
        this.x = startX;
        this.y = startY;
        this.attackTimer = 0;
        if (lives == 0) {
            lives = 3;
            lose();
            return;
        }
        drawCanvas();
    };

    // used to calcuate where ghost should move
    this.getNearestNode = function () {
        switch (moveState) {
        case 1:
            if (x == 0) { return 16; }
            var tx = Math.ceil(this.x);
            var ty = this.y;
            while (true) {
                if (vertLevel[tx][ty] != -1) { return vertLevel[tx][ty]; }
                tx -= 1;
            }
            break;
        case 2:
            if (y == 0) { return 16; }
            var tx = this.x;
            var ty = Math.ceil(this.y);
            while (true) {
                if (vertLevel[tx][ty] != -1) { return vertLevel[tx][ty]; }
                ty -= 1;
            }
            break;
        case 3:
            if (x == s.cols - 1) { return 16; }
            var tx = Math.floor(this.x);
            var ty = this.y;
            while (true) {
                if (vertLevel[tx][ty] != -1) { return vertLevel[tx][ty]; }
                tx += 1;
            }
            break;
        case 4:
            if (y == s.rows - 1) { return 16; }
            var tx = this.x;
            var ty = Math.floor(this.y);
            while (true) {
                if (vertLevel[tx][ty] != -1) { return vertLevel[tx][ty]; }
                ty += 1;
            }
            break;
        default:
        {
            var tx = pacman.x;
            var ty = pacman.y;
            return 16;
        }
        }
        return 0;
    };

    // reset game
    this.reset = function () {
        redG.reset();
        pinkG.reset();
        blueG.reset();
        orangeG.reset();

        lives = 3;
        this.x = startX;
        this.y = startY;
        this.attackTimer = 0;
    };

    // test collision with ghost
    this.collisionTest = function (boundary) {
        if (boundary.x + 1 < this.x) { return false; }
        if (boundary.x > this.x + 1) { return false; }
        if (boundary.y + 1 < this.y) { return false; }
        if (boundary.y > this.y + 1) { return false; }
        return true;
    };

    // what to do when collision
    this.collisionAction = function (ghost) {
        if (ghost.alive == true && this.collisionTest(ghost) == true) {
            if (pacman.attackTimer == 0) {
                this.die();
            } else {
                pacman.attackTimer = 0;
                vel = 0.125;
                redG.inDanger = false;
                pinkG.inDanger = false;
                orangeG.inDanger = false;
                blueG.inDanger = false;

                ghost.die();
            }
        }
    };

    // which ghost should test collision with
    this.collisionWithGhost = function () {
        this.collisionAction(redG);
        this.collisionAction(pinkG);
        this.collisionAction(blueG);
        this.collisionAction(orangeG);
    };

    // display pacman
    this.render = function () {
        var px = pacman.x * s.width + s.shiftX;
        var py = pacman.y * s.height + s.shiftY;

        var tempLoc = 30 * (Math.floor(picState / 1.5) % 4);

        if (pacman.attackTimer != 0) {
            switch (moveState) {
            case 1:
                c.drawImage(pic1s, tempLoc, 0, 30, 30, px, py, 30, 30);
                break;
            case 2:
                c.drawImage(pic2s, tempLoc, 0, 30, 30, px, py, 30, 30);
                break;
            case 3:
                c.drawImage(pic3s, tempLoc, 0, 30, 30, px, py, 30, 30);
                break;
            case 4:
                c.drawImage(pic4s, tempLoc, 0, 30, 30, px, py, 30, 30);
                break;
            default:
            {
                picState--;
                switch (lastState) {
                case 1:
                    c.drawImage(pic1s, tempLoc, 0, 30, 30, px, py, 30, 30);
                    break;
                case 2:
                    c.drawImage(pic2s, tempLoc, 0, 30, 30, px, py, 30, 30);
                    break;
                case 3:
                    c.drawImage(pic3s, tempLoc, 0, 30, 30, px, py, 30, 30);
                    break;
                case 4:
                    c.drawImage(pic4s, tempLoc, 0, 30, 30, px, py, 30, 30);
                    break;

                default:
                    console.log("This shouldn't display: render!");
                }
            }
            }

            return;
        }
        switch (moveState) {
        case 1:
            c.drawImage(pic1, tempLoc, 0, 30, 30, px, py, 30, 30);
            break;
        case 2:
            c.drawImage(pic2, tempLoc, 0, 30, 30, px, py, 30, 30);
            break;
        case 3:
            c.drawImage(pic3, tempLoc, 0, 30, 30, px, py, 30, 30);
            break;
        case 4:
            c.drawImage(pic4, tempLoc, 0, 30, 30, px, py, 30, 30);
            break;
        default:
        {
            picState--;
            switch (lastState) {
            case 1:
                c.drawImage(pic1, tempLoc, 0, 30, 30, px, py, 30, 30);
                break;
            case 2:
                c.drawImage(pic2, tempLoc, 0, 30, 30, px, py, 30, 30);
                break;
            case 3:
                c.drawImage(pic3, tempLoc, 0, 30, 30, px, py, 30, 30);
                break;
            case 4:
                c.drawImage(pic4, tempLoc, 0, 30, 30, px, py, 30, 30);
                break;

            default:
                console.log("This shouldn't display: render!");
            }
        }
        }
    };

    // show how many lives pacman has
    this.renderLives = function () {
        switch (lives) {
        case 1:
            c.drawImage(miniPacman, 540, 3);
            break;
        case 2:
            c.drawImage(miniPacman, 510, 3);
            c.drawImage(miniPacman, 540, 3);
            break;
        case 3:
            c.drawImage(miniPacman, 480, 3);
            c.drawImage(miniPacman, 510, 3);
            c.drawImage(miniPacman, 540, 3);
            break;
        default:
            console.log('Should not display: Lives');
        }
    };
}
// pacman declaration
var pacman = new Pacman(1, 1);

// helper functions
function realX (x) {
    return x * s.width + s.shiftX;
}

function realY (y) {
    return y * s.height + s.shiftY;
}

//////////////////////////////////////////////////////////////////////////////
// Ghost Class Declaration
//////////////////////////////////////////////////////////////////////////////

var picGState = 12;
var inDangerPic = new Image();
inDangerPic.src = 'img/ghost.png';

function Ghost (picLoc, id) {
    // public
    this.alive = true;
    this.x = 0;
    this.y = 0;
    this.w = 30;
    this.h = 30;
    this.nextState = 4;
    this.moveState = 4;
    this.lastState = 4;
    this.inDanger = false;
    this.id = id;
    this.moves = 0;
    this.lastNode = 0;
    this.howManyMoves = 0;
    this.path = new Array();

    // private
    var direction = 0;
    var isMoving = false;
    var startX = x;
    var startY = y;
    var pic = new Image();
    pic.src = picLoc;

    // functions
    this.render = function () {
    // ghost is in danger
        if (this.inDanger == true) {
            var tempLoc = 30 * (Math.floor(picGState / 6) % 2);
            var rx = this.x * s.width + s.shiftX;
            var ry = this.y * s.height + s.shiftY;
            c.drawImage(inDangerPic, tempLoc, 0, 30, 30, rx, ry, 30, 30);
            return;
        }
        // if ghost is not in danger
        if (this.moveState != 0) { var tempLoc = 30 * (Math.floor(picGState / 6) % 2) + (this.moveState - 1) * 2 * 30; } else { var tempLoc = 30 * (Math.floor(picGState / 6) % 2) + (this.lastState - 1) * 2 * 30; }
        var rx = this.x * s.width + s.shiftX;
        var ry = this.y * s.height + s.shiftY;
        c.drawImage(pic, tempLoc, 0, 30, 30, rx, ry, 30, 30);
    };

    // start location for ghost
    this.chooseLoc = function (locIn) {
    // this.lastNode = Math.floor((Math.random() * vertexCount));
        this.lastNode = locIn;
        var node = vertices[this.lastNode];
        this.x = node.x;
        this.y = node.y;
    };

    // used to reset ghost
    this.reset = function () {
        this.howManyMoves = 0;
        this.moves = 0;
        this.alive = true;
        this.nextState = 4;
        this.moveState = 4;
        this.lastState = 4;
        this.inDanger = false;
        this.path = [];
        this.chooseLoc(Math.floor(Math.random() * (vertexCount - 10)) + 10);
    };

    // if ghost dies
    this.die = function () {
        this.howManyMoves = 0;
        this.alive = false;
        this.chooseLoc(Math.floor(Math.random() * (vertexCount - 10)) + 10);
        eatGhostSound.play();
    };
}

// declare ghost
var redG = new Ghost('img/redG.png', 1);
var pinkG = new Ghost('img/pinkG.png', 2);
var blueG = new Ghost('img/blueG.png', 3);
var orangeG = new Ghost('img/orangeG.png', 4);

// chose their locations
redG.chooseLoc(13);
blueG.chooseLoc(19);
pinkG.chooseLoc(22);
orangeG.chooseLoc(34);


//////////////////////////////////////////////////////////////////////////////
// Heart of Program
//////////////////////////////////////////////////////////////////////////////

window.addEventListener('load', loadP);
function loadP () {
    // declaring canvas
    canvas = document.getElementById('gCanvas');
    canvas.addEventListener('mouseup', mouseInput, false);
    window.addEventListener('keydown', keyboardInput, false);
    canvasH = canvas.height;
    canvasW = canvas.width;
    canvas.oncontextmenu = function () {
        return false;
    };

    // giving it style
    c = canvas.getContext('2d');
    c.font = 'bold 18px verdana, sans-serif ';
    c.fillStyle = '#ffffff';

    // pushing map
    s.shiftX = (canvasW - mapW) / 2;
    s.shiftY = (canvasH - mapH) - 40;

    // declaring teleport locations
    xt1 = realX(s.cols - 1) - 4;
    xt2 = realX(15) - 4;
    xt3 = realX(0) - 4;
    xt4 = realX(4) - 4;
    yt1 = realY(3) - 4;
    yt2 = realY(s.rows - 1) - 4;
    yt3 = realY(9) - 4;
    yt4 = realY(0) - 4;

    drawCanvas();
}

////////////////////////////   function main loop
function mainLoop () {
    // Logic.
    move();
    if (redG.alive == true) {
        redG.moveGhost(1);
    }
    if (pinkG.alive == true) {
        pinkG.moveGhost(2);
    }
    if (blueG.alive == true) {
        blueG.moveGhost(3);
    }
    if (orangeG.alive == true) {
        orangeG.moveGhost(4);
    }

    // I dont render whole map every game iteration
    // rather only the parts where movement takes place
    picChanges.push(new Point(pacman.x, pacman.y));
    picChanges.push(new Point(redG.x, redG.y));
    picChanges.push(new Point(pinkG.x, pinkG.y));
    picChanges.push(new Point(blueG.x, blueG.y));
    picChanges.push(new Point(orangeG.x, orangeG.y));

    // used for sprites
    picState++;
    picGState++;

    // Render.
    drawChanges();

    // test collision with ghost
    pacman.collisionWithGhost();
}

//////////////////////////////////////  timer

function timer () {
    if (pacman.attackTimer != 0) {
        pacman.attackTimer--;
        if (pacman.attackTimer == 0) {
            vel = 0.125;
            redG.inDanger = false;
            pinkG.inDanger = false;
            orangeG.inDanger = false;
            blueG.inDanger = false;
        }
    }
    clock.time++;
    if (clock.time == 999) {
        clock.time = 989;
    }
}


//////////////////////////////////////////////////////////////////////////////
// Rendering
//////////////////////////////////////////////////////////////////////////////

// draw full canvas
function drawCanvas () {
    c.fillStyle = 'rgba( 38, 138,208,1)';
    c.fillRect(0, 0, 600, 450);

    for (i = 0; i < s.cols; i++) {
        for (j = 0; j < s.rows; j++) {
            var x = i * s.width + s.shiftX;
            var y = j * s.height + s.shiftY;
            drawBox(i, j, x, y);
        }
    }

    c.fillStyle = 'rgba( 138, 138,138,1)';
    c.fillRect(27, 27, 1, 336);
    c.fillRect(27, 27, 546, 1);
    c.fillRect(27, 363, 546, 1);
    c.fillRect(573, 27, 1, 336);

    // draw teleports pictures   --- should I change?
    c.fillRect(xt1 + 8, yt1 - 1, 30, 1);
    c.fillRect(xt1 + 8, yt1 + 38, 30, 1);
    c.fillRect(xt2 - 1, yt2 + 8, 1, 30);
    c.fillRect(xt2 + 38, yt2 + 8, 1, 30);
    c.fillRect(xt3 + 1, yt3 - 1, 30, 1);
    c.fillRect(xt3 + 1, yt3 + 38, 30, 1);
    c.fillRect(xt4 - 1, yt4 + 1, 1, 30);
    c.fillRect(xt4 + 38, yt4 + 1, 1, 30);

    c.drawImage(spacePic, xt1, yt1);
    c.drawImage(spacePic, xt2, yt2);
    c.drawImage(spacePic, xt3, yt3);
    c.drawImage(spacePic, xt4, yt4);

    // draw characters
    // draw ghost
    if (redG.alive == true) {
        redG.render();
    }
    if (blueG.alive == true) {
        blueG.render();
    }
    if (pinkG.alive == true) {
        pinkG.render();
    }
    if (orangeG.alive == true) {
        orangeG.render();
    }

    // pacman
    pacman.render();
    pacman.renderLives();

    // draws whole bottom
    drawBottom();
}

// draw only changes
function drawChanges () {
    c.fillStyle = 'rgba( 0, 0, 0,1)';
    for (var k = 0; k < picChangesSize; k++) {
        var p = picChanges[k];
        var i = Math.round(p.x);
        var j = Math.round(p.y);
        var x = i * s.width + s.shiftX;
        var y = j * s.height + s.shiftY;

        drawBox2(i, j, x, y);
        if (i > 0) { drawBox2(i - 1, j, x - s.width, y); }
        if (i < s.cols - 1) { drawBox2(i + 1, j, x + s.width, y); }
        drawBox2(i, j + 1, x, y + s.height);
        drawBox2(i, j - 1, x, y - s.height);
    }
    picChanges = [];

    c.fillStyle = 'rgba( 138, 138,138,1)';
    c.fillRect(27, 27, 1, 336);
    c.fillRect(27, 27, 546, 1);
    c.fillRect(27, 363, 546, 1);
    c.fillRect(573, 27, 1, 336);

    // draw teleports
    c.fillRect(xt1 + 8, yt1 - 1, 30, 1);
    c.fillRect(xt1 + 8, yt1 + 38, 30, 1);

    c.fillRect(xt3 + 1, yt3 - 1, 30, 1);
    c.fillRect(xt3 + 1, yt3 + 38, 30, 1);

    c.fillRect(xt2 - 1, yt2 + 8, 1, 30);
    c.fillRect(xt2 + 38, yt2 + 8, 1, 30);

    c.fillRect(xt4 - 1, yt4 + 1, 1, 30);
    c.fillRect(xt4 + 38, yt4 + 1, 1, 30);

    c.drawImage(spacePic, xt1, yt1);
    c.drawImage(spacePic, xt2, yt2);
    c.drawImage(spacePic, xt3, yt3);
    c.drawImage(spacePic, xt4, yt4);

    // Draw characters.
    // Draw ghost.
    if (redG.alive == true) {
        redG.render();
    }
    if (blueG.alive == true) {
        blueG.render();
    }
    if (pinkG.alive == true) {
        pinkG.render();
    }
    if (orangeG.alive == true) {
        orangeG.render();
    }

    // pacman
    pacman.render();
    pacman.renderLives();

    // draw bottom of level
    drawBottomChanges();
}

// used to see what box to render
function drawBox2 (i, j, x, y) {
    if (level[i][j] == -1) {
        c.fillRect(x, y, 30, 30);
    } else if (level[i][j] == 1) {
        c.drawImage(foodPic, x - 4, y - 4);
    } else if (level[i][j] == 4) {
        c.fillRect(x, y, 30, 30);
    } else if (level[i][j] == 2) {
        c.drawImage(powerUpPic, x - 4, y - 4);
    }
}

// used to see what box to display
function drawBox (i, j, x, y) {
    if (level[i][j] == -1) {
        c.drawImage(spacePic, x - 4, y - 4);
    } else if (level[i][j] == 1) {
        c.drawImage(foodPic, x - 4, y - 4);
    } else if (level[i][j] == 4) {
        c.drawImage(spacePic, x - 4, y - 4);
    } else if (level[i][j] == 2) {
        c.drawImage(powerUpPic, x - 4, y - 4);
    }
}

// draws only bottom changes live score and clock
function drawBottomChanges () {
    c.drawImage(smallBG, clock.x, 390);

    c.fillStyle = 'rgba( 255, 255, 255,1)';
    // draw time
    c.drawImage(clockPic, clock.x, clock.y);
    c.fillText(clock.time, clock.x + 35, clock.y + 20);

    // draw score
    c.fillText('%', 525, clock.y + 19);
    var percent = Math.floor((s.score) / 119 * 100);
    c.fillText(percent, 555, clock.y + 19);
}

// draw all of bottom
function drawBottom () {
    // setup bottom
    c.drawImage(bg, 0, 390);
    c.fillStyle = 'rgba(255,255, 255,1)';

    // add start buttons
    if (startReset.start == true) {
        c.drawImage(startPic, startReset.x, startReset.y);
    } else {
        c.drawImage(resetPic, startReset.x, startReset.y);
    }

    // draw time
    c.drawImage(clockPic, clock.x, clock.y);
    c.fillText(clock.time, clock.x + 35, clock.y + 20);

    // draw score
    c.fillText('%', 525, clock.y + 19);
    var percent = Math.floor((s.score) / 119 * 100);
    c.fillText(percent, 555, clock.y + 19);
}

//////////////////////////////////////////////////////////////////////////////
// Winning / Losing
//////////////////////////////////////////////////////////////////////////////

// reset game main function
function resetGame () {
    clearInterval(clock.id);
    clearInterval(mainId);
    clock.time = 0;

    // -1 eaten food
    // 0 wall
    // 1 food
    // 2 power up
    // 3 black hole
    // 4 space
    level = [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, 3, -1, -1, -1],
        [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
        [-1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, -1],
        [-1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, -1],
        [3, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, -1],
        [-1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, -1],
        [-1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, -1],
        [-1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1],
        [-1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, -1],
        [-1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, -1],
        [-1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, -1],
        [-1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, -1],
        [-1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1],
        [-1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, -1],
        [-1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, -1],
        [-1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 3],
        [-1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, -1],
        [-1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, -1],
        [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
        [-1, -1, -1, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ];
    level[4][9] = 2;
    level[15][3] = 2;
    level[13][7] = 2;
    level[6][5] = 2;

    // reset everything else
    bgMusic.pause();
    picState = 12;
    moveState = 3;
    nextState = 3;
    pacman.reset();
    s.score = 0;
    foodCount = 119;
    bgMusic.currentTime = 0;
    vel = 0.125;

    // render changes
    drawCanvas();
}

// lose   do I use this?
function lose () {
    console.log('You Lost! :(');
    startReset.start = false;
    bgMusic.pause();

    clearInterval(clock.id);
    clearInterval(mainId);

    c.fillStyle = '#222222';
    c.fillRect(0, 0, 600, 390);
    c.drawImage(gameOverPic, 170, 125);
}

function winning () {
    // stop game from running
    startReset.start = false;
    clearInterval(clock.id);
    clearInterval(mainId);

    // play sounds
    bgMusic.pause();
    tada.play();

    // reset pacman's spirte picture state
    picState = 12;

    // render changes
    drawCanvas();
}

//////////////////////////////////////////////////////////////////////////////
// Moving.
//////////////////////////////////////////////////////////////////////////////

// click pass
function move () {
    // get pacman's location info
    var x = pacman.x;
    var y = pacman.y;
    var xu = Math.ceil(pacman.x);
    var yu = Math.ceil(pacman.y);
    var xd = Math.floor(pacman.x);
    var yd = Math.floor(pacman.y);

    // should pacman be teleported
    testIfTeleport(x, y);

    // if changing direction
    if (nextState != moveState) {
        switch (nextState) {
        case 1:
        // don't move on non int value
            if (y % 1 != 0) {
                break;
            }
            // changing from right to left
            if (x % 1 != 0) {
                pacman.x -= vel;
                moveState = nextState;
                return;
            }
            // changing from vertical to horizontal
            if (!(level[x - 1][yu] <= 0 || level[x - 1][yd] <= 0)) {
                moveState = nextState;
                pacman.x -= vel;
                eatFood();
                return;
            }
            break;

        case 2:
        // don't move on non int value
            if (x % 1 != 0) {
                break;
            }
            // changing from right to left
            if (y % 1 != 0) {
                pacman.y -= vel;
                moveState = nextState;
                return;
            }
            // changing from vertical to horizontal
            if (!(yu <= 0 || level[xu][y - 1] <= 0 || level[xd][y - 1] <= 0)) {
                moveState = nextState;
                pacman.y -= vel;
                eatFood();
                return;
            }
            break;

        case 3:
        // don't move on non int value
            if (y % 1 != 0) {
                break;
            }
            // changing from right to left
            if (x % 1 != 0) {
                pacman.x += vel;
                moveState = nextState;
                return;
            }
            // changing from vertical to horizontal
            if (!(xd >= s.cols - 1 || level[x + 1][yd] <= 0 || level[x + 1][yu] <= 0)) {
                moveState = nextState;
                pacman.x += vel;
                eatFood();
                return;
            }
            break;

        case 4:
        // don't move on non int value
            if (x % 1 != 0) {
                break;
            }
            // changing from right to left
            if (y % 1 != 0) {
                pacman.y += vel;
                moveState = nextState;
                return;
            }
            // changing from vertical to horizontal
            if (!(yd >= s.rows - 1 || level[xd][y + 1] <= 0 || level[xu][y + 1] <= 0)) {
                moveState = nextState;
                pacman.y += vel;
                eatFood();
                return;
            }
            break;
        }
    }

    if (moveState == 0) { return; }

    // testing if pacman can still move
    switch (moveState) {
    // a pressed
    case 1:
        if (x % 1 != 0) {
            pacman.x -= vel;
            return;
        } else if (xd == 0) {
            if (x - vel >= 0) {
                pacman.x -= vel;
            } else {
                lastState = moveState;
                moveState = 0;
            }

            return;
        } else if (level[x - 1][yu] <= 0 || level[x - 1][yd] <= 0) {
            lastState = moveState;
            moveState = 0;
            return;
        }
        pacman.x -= vel;
        break;

        // w pressed
    case 2:
        if (y % 1 != 0) {
            pacman.y -= vel;
            return;
        }
        if (yu <= 0 || level[xu][y - 1] <= 0 || level[xd][y - 1] <= 0) {
            lastState = moveState;
            moveState = 0;
            return;
        }

        pacman.y -= vel;
        break;

        // d pressed
    case 3:
        if (x % 1 != 0) {
            pacman.x += vel;
            return;
        }
        if (xu == s.cols - 1) {
        // added for array
            eatFood();

            if (x + vel <= s.cols - 1) {
                pacman.x += vel;
            } else {
                lastState = moveState;
                moveState = 0;
            }
            return;
        }
        if (xd >= s.cols - 1 || level[x + 1][yd] <= 0 || level[x + 1][yu] <= 0) {
            lastState = moveState;
            moveState = 0;
            return;
        }
        pacman.x += vel;
        break;

        // s pressed
    case 4:
        if (y % 1 != 0) {
            pacman.y += vel;
            return;
        }
        if (yd >= s.rows - 1 || level[xd][y + 1] <= 0 || level[xu][y + 1] <= 0) {
            lastState = moveState;
            moveState = 0;
            return;
        }
        pacman.y += vel;
        break;

    default:
        console.log("This shouldn't display move!");
    }

    // test if eat food or power up
    eatFood();
}

// test if teleport
function testIfTeleport (x, y) {
    // see if teleport
    if (x == 0 || y == 0 || y == s.rows - 1 || x == s.cols - 1) {
        if (y == 9 && moveState == 1) {
            teleportSound.play();
            pacman.x = s.cols - 1;
            pacman.y = 3;
            nextState = 1;
            moveState = 1;
        } else if (x == 4 && moveState == 2) {
            teleportSound.play();
            pacman.x = 15;
            pacman.y = s.rows - 1;
            nextState = 2;
            moveState = 2;
        } else if (y == 3 && moveState == 3) {
            teleportSound.play();
            pacman.x = 0;
            pacman.y = 9;
            nextState = 3;
            moveState = 3;
        } else if (x == 15 && moveState == 4) {
            teleportSound.play();
            pacman.x = 4;
            pacman.y = 0;
            nextState = 4;
            moveState = 4;
        }
    }
}

// test if eat food or power up
function eatFood () {
    switch (moveState) {
    case 1:
        var x1 = Math.floor(pacman.x);
        var y1 = Math.round(pacman.y);
        break;
    case 2:
        var x1 = Math.round(pacman.x);
        var y1 = Math.floor(pacman.y);
        break;
    case 3:
        var x1 = Math.ceil(pacman.x);
        var y1 = Math.round(pacman.y);
        break;
    case 4:
        var x1 = Math.round(pacman.x);
        var y1 = Math.ceil(pacman.y);
        break;
    }

    if (level[x1][y1] == 1) {
        level[x1][y1] = 4;
        foodCount--;
        s.score += 1;

        chompSound.play();
        if (foodCount < 0) {
            winning();
        }
    } else if (level[x1][y1] == 2) {
        level[x1][y1] = 4;
        pacman.attackTimer = 5;
        vel = 0.25;
        if (pacman.x * 4 % 1 != 0) {
            pacman.x += 0.125;
        }
        if (pacman.y * 4 % 1 != 0) {
            pacman.y += 0.125;
        }

        redG.inDanger = true;
        pinkG.inDanger = true;
        orangeG.inDanger = true;
        blueG.inDanger = true;

        powerUpSound.play();
    }
}


//////////////////////////////////////////////////////////////////////////////
// Moving For Ghost.
//////////////////////////////////////////////////////////////////////////////

Ghost.prototype.moveGhost = function (gID) {
    if (this.moves > 0) {
        this.moveMe();
    } else {
    // vertices holds    use vertlevel to get node
    // pick direction to go from nodes at random
    // find out number of moves it would take
    // up date moves and lastnode
    // then move

        if (gID > 2) {
            this.getRandomMove();
            this.moveMe();
        } else {
            this.howManyMoves++;
            if (this.howManyMoves == gID + 1) {
                this.howManyMoves = 0;
                path = [];
            }

            if (this.path.length == 0) {
                // calculate next several moves
                this.calculateMoves(gID);

                // could be zero moves
                if (this.path.length == 0) {
                    return;
                }

                // get moves and direction
                this.getMandD();

                // get and remove last element location
                this.lastNode = this.path.pop();
            } else {
                // get moves and direction
                this.getMandD();

                // get and remove last element location
                this.lastNode = this.path.pop();
            }
        }
    }
};

// get moves and direction for ghost
Ghost.prototype.getMandD = function () {
    // calulate moves direction
    var next = vertices[this.path[this.path.length - 1]];
    if (next.n1 != -1 && next.n1 == this.lastNode) {
        this.moves = vertices[next.n1].edge3 / velG;
        this.direction = 3;
    } else if (next.n2 != -1 && next.n2 == this.lastNode) {
        this.moves = vertices[next.n2].edge4 / velG;
        this.direction = 4;
    } else if (next.n3 != -1 && next.n3 == this.lastNode) {
        this.moves = vertices[next.n3].edge1 / velG;
        this.direction = 1;
    } else if (next.n4 != -1 && next.n4 == this.lastNode) {
        this.moves = vertices[next.n4].edge2 / velG;
        this.direction = 2;
    }
};

// used for certain ghost to move randomly
Ghost.prototype.getRandomMove = function (gID) {
    var tryThis;
    var wholeVal;

    while (true) {
    // generate next location and test validity
        tryThis = Math.floor((Math.random() * 4)) + 1;
        switch (tryThis) {
        case 1:
            wholeVal = vertices[this.lastNode].edge1;
            break;
        case 2:
            wholeVal = vertices[this.lastNode].edge2;
            break;
        case 3:
            wholeVal = vertices[this.lastNode].edge3;
            break;
        case 4:
            wholeVal = vertices[this.lastNode].edge4;
            break;
        }
        // test if moving backwards
        var lastDir;
        switch (this.direction) {
        case 1:
            lastDir = 3;
            break;
        case 2:
            lastDir = 4;
            break;
        case 3:
            lastDir = 1;
            break;
        case 4:
            lastDir = 2;
            break;
        }

        if (lastDir != tryThis && wholeVal != 0) {
            break;
        }
    }

    // get number of moves
    this.moves = wholeVal / velG;
    // update direction
    this.direction = tryThis;
    // setting next node
    var x = vertices[this.lastNode].x;
    var y = vertices[this.lastNode].y;
    switch (this.direction) {
    case 1:
        this.lastNode = vertLevel[x - wholeVal][y];
        break;
    case 2:
        this.lastNode = vertLevel[x][y - wholeVal];
        break;
    case 3:
        this.lastNode = vertLevel[x + wholeVal][y];
        break;
    case 4:
        this.lastNode = vertLevel[x][y + wholeVal];
        break;
    }
};

// for this function I use dijkstra's algorithm to calcuate
// the next several moves for any ghost calling the function
Ghost.prototype.calculateMoves = function (gID) {
    resetVertices();
    var nearestNode = pacman.getNearestNode();

    // create new list
    var set = new SortedSet();

    // used to iterate over values
    // this.lastNode is start node
    vertices[this.lastNode].value = 0;
    var current = this.lastNode;

    // mark begining node
    vertices[current].visited = true;
    vertices[current].value = 0;

    for (var i = 0; i < vertexCount; i++) {
        if (current == nearestNode) { break; }

        // see which node testing
        var n = vertices[current];

        if (n.n1 != -1 && vertices[n.n1].visited == false) {
            var n1 = vertices[n.n1];
            if (n.value + n.edge1 < n1.value) {
                n1.value = n.value + n.edge1;
                n1.parent = current;
            }
            set.add(n.n1);
        }
        if (n.n2 != -1 && vertices[n.n2].visited == false) {
            var n2 = vertices[n.n2];
            if (n.value + n.edge2 < n2.value) {
                n2.value = n.value + n.edge2;
                n2.parent = current;
            }
            set.add(n.n2);
        }
        if (n.n3 != -1 && vertices[n.n3].visited == false) {
            var n3 = vertices[n.n3];
            if (n.value + n.edge3 < n3.value) {
                n3.value = n.value + n.edge3;
                n3.parent = current;
            }
            set.add(n.n3);
        }
        if (n.n4 != -1 && vertices[n.n4].visited == false) {
            var n4 = vertices[n.n4];
            if (n.value + n.edge4 < n4.value) {
                n4.value = n.value + n.edge4;
                n4.parent = current;
            }

            set.add(n.n4);
        }

        // now to find smallest value
        var min = 10000;
        var removeMe;
        for (var j = 0; j < set._length; j++) {
            if (min > vertices[set.item(j)].value) {
                min = vertices[set.item(j)].value;
                current = set.item(j);
                removeMe = j;
            }
        }

        vertices[current].visited = true;
        set.remove(removeMe);
    }

    // now to trace back
    var itter = nearestNode;
    while (true) {
        if (itter == this.lastNode) { break; }
        this.path.push(itter);
        itter = vertices[itter].parent;
    }
};

Ghost.prototype.moveMe = function () {
    this.moves--;

    switch (this.direction) {
    case 1:
        this.x -= velG;
        break;
    case 2:
        this.y -= velG;
        break;
    case 3:
        this.x += velG;
        break;
    case 4:
        this.y += velG;
        break;
    }
};

// test if teleport
Ghost.prototype.testIfTeleportG = function () {
    var x = this.x;
    var y = this.y;
    // see if teleport
    if (x == 0 || y == 0 || y == s.rows - 1 || x == s.cols - 1) {
        if (y == 9 && this.moveState == 1) {
            this.x = s.cols - 1;
            this.y = 3;
            this.nextState = 1;
            this.moveState = 1;
        } else if (x == 4 && this.moveState == 2) {
            this.x = 15;
            this.y = s.rows - 1;
            this.nextState = 2;
            this.moveState = 2;
        } else if (y == 3 && this.moveState == 3) {
            this.x = 0;
            this.y = 9;
            this.nextState = 3;
            this.moveState = 3;
        } else if (x == 15 && this.moveState == 4) {
            this.x = 4;
            this.y = 0;
            this.nextState = 4;
            this.moveState = 4;
        }
    }
};


//////////////////////////////////////////////////////////////////////////////
// Ghost Pacman Collision.
//////////////////////////////////////////////////////////////////////////////

function collision (boundary, x, y) {
    if (boundary.x + boundary.w < x) { return false; }
    if (boundary.x > x) { return false; }
    if (boundary.y + boundary.h < y) { return false; }
    if (boundary.y > y) { return false; }

    return true;
}


//////////////////////////////////////////////////////////////////////////////
// Mouse / Keyboard.
//////////////////////////////////////////////////////////////////////////////

//  get actual position
function getMousePos (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// onclick
function mouseInput (e) {
    var pos = getMousePos(canvas, e);
    mX = pos.x - s.shiftX;
    mY = pos.y - s.shiftY;

    // see if click on button
    if (collision(startReset, pos.x, pos.y) == true) {
        if (startReset.start == true) {
            clock.id = setInterval(timer, 1000);
            clock.time++;
            mainId = setInterval(mainLoop, 33);
            startReset.start = false;
            bgMusic.play();
            pressB.play();
        } else {
            startReset.start = true;
            resetGame();
            pressB.play();
        }
        drawCanvas();
    }
}

//    keyboard input

function keyboardInput (e) {
    // start game with button or by pressing "m"
    // if (e.keyCode == 77) {
    // if (startReset.start == true) {
    // console.log('Start Game');
    // clock.id = setInterval(timer, 1000);
    // clock.time++;
    // mainId = setInterval(mainLoop, 30);
    // startReset.start = false;
    // bgMusic.play();
    // pressB.play();
    // } else {
    // bgMusic.pause();
    // console.log('Reset Game');
    // startReset.start = true;
    // resetGame();
    // pressB.play();
    // }
    // drawCanvas();
    // return;
    // }

    // see if game has started
    if (startReset.start == true) {
        return;
    }

    // set which way pacman should move next (when can)
    var code = e.keyCode;
    switch (code) {
    case 65:
        nextState = 1;
        break;
    case 97:
        nextState = 1;
        break;
    case 68:
        nextState = 3;
        break;
    case 100:
        nextState = 3;
        break;
    case 83:
        nextState = 4;
        break;
    case 115:
        nextState = 4;
        break;
    case 87:
        nextState = 2;
        break;
    case 119:
        nextState = 2;
        break;
    }
}
