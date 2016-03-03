// Enemies our player must avoid
var Enemy = function(speed, initRow, currentPlayer) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.player = currentPlayer;
    this.speed = speed;
    this.x = 0;
    this.y = 83 * initRow - 20;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 500)
        this.x += dt * this.speed;
    else {
        this.x = 0;
        this.speed = Math.random() * 150 + 60;
    }
    // Handle collision
    if (this.x < this.player.x + 80 &&
        this.x + 80 > this.player.x &&
        this.y < this.player.y + 83 &&
        this.y + 83 > this.player.y) {
        this.player.resetPosition();
        this.player.resetScore();
    }
};
    // Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Player Class
var Player = function() {
    this.playerList = [
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-boy.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];
    //player default location
    this.x = 2 * 101;
    this.y = 5 * 83 - 20;
    this.selector = 'images/Selector.png';
    this.selectorId = 2;
    this.isSelected = false;
    this.score = 0;
};
Player.prototype.update = function(dt) {
};
    // Render characters on character select screen and
    // selected character
Player.prototype.render = function() {
    var id = this.selectorId;
    if (this.isSelected === true) {
        ctx.drawImage(Resources.get(this.playerList[id]), this.x, this.y);
    } else {
        var pList = this.playerList;
        ctx.drawImage(Resources.get(this.selector), this.selectorId * 101, 5 * 83 - 20);
        for (var player in pList) {
            ctx.drawImage(Resources.get(pList[player]), player * 101, 5 * 83 - 20);
        }
    }
};
    // Handle inputs on character select screen
Player.prototype.handleSelectInput = function(input) {
    var id = this.selectorId;
    if (this.isSelected === false)
        switch (input) {
            case 'left':
                if (id > 0) this.selectorId -= 1;
                break;
            case 'right':
                if (id < 4) this.selectorId += 1;
                break;
            case 'enter':
                this.isSelected = true;
        }
};
    // Handle character control input
Player.prototype.handleInput = function(input) {
    if (this.isSelected === true)
        switch (input) {
            case 'left':
                if (this.x > 0) this.x -= 101;
                break;
            case 'right':
                if (this.x < 400) this.x += 101;
                break;
            case 'up':
                if (this.y > 83) this.y -= 83;
                else {
                    this.resetPosition();
                    this.score += 10;
                }
                break;
            case 'down':
                if (this.y < 350) this.y += 83;
                break;
        }
};

Player.prototype.resetPosition = function() {
    this.x = 2 * 101;
    this.y = 5 * 83 - 20;
};
Player.prototype.resetScore = function() {
    this.score = 0;
}



// Gem class, defines collectible items randomly appear on screen
var gemlist = ['images/GemBlue.png', 'images/GemGreen.png', 'images/GemOrange.png'];
var Gem = function(currentPlayer) {
    this.player = currentPlayer;
    this.x = Math.floor(Math.random() * 4) * 101;
    this.y = 83 * (Math.floor(Math.random() * 3) + 1) - 20;
    this.sprite = gemlist[Math.floor(Math.random() * (gemlist.length))];
    this.isCollected = false;
};
    // draw collectible item if there isn't any yet
Gem.prototype.render = function() {
    if (this.isCollected === false) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};
    // Check collison with player position
    // once collected, new item will have 0.5% chance being rendered on frame
Gem.prototype.update = function() {
    if (this.isCollected === false) {
        if (this.x < this.player.x + 80 &&
            this.x + 80 > this.player.x &&
            this.y < this.player.y + 83 &&
            this.y + 83 > this.player.y) {
            this.isCollected = true;
            this.player.score += 20;
        }
    } else {
        this.x = Math.floor(Math.random() * 4) * 101;
        this.y = 83 * (Math.floor(Math.random() * 3) + 1) - 20;
        this.sprite = gemlist[Math.floor(Math.random() * (gemlist.length))];
        if ((Math.floor(Math.random() * 200) + 1) === 1)
            this.isCollected = false;
    }
};


// Score board class
var ScoreBoard = function(currentPlayer) {
    this.player = currentPlayer;
    this.x = 20;
    this.y = 110;
    this.score = currentPlayer.score;
};
ScoreBoard.prototype.update = function() {
    this.score = this.player.score;
};
ScoreBoard.prototype.render = function() {
    ctx.font = "36pt Impact";
    ctx.textAlign = "left";

    ctx.fillStyle = "white";
    ctx.fillText("Your score: " + this.player.score, this.x, this.y);

    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.strokeText("Your score: " + this.player.score, this.x, this.y);
}

// Instantiate  objects.
// Place the player object in a variable called player
var player = new Player();
// Instantiate Gem and ScoreBoard object for current player
var gem = new Gem(player);
var scoreBoard = new ScoreBoard(player);

// All enemy objects in an array called allEnemies
var allEnemies = new Array();
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy((Math.random() * 150 + 60), i + 1, player));
}

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var allowedSelectKeys = {
        37: 'left',
        13: 'enter',
        39: 'right',
    };
    player.handleSelectInput(allowedSelectKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});