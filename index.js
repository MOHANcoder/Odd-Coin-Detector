const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = canvas.height = Math.min(window.innerWidth, window.innerHeight) - 10;

const CENTER = canvas.width / 2;

c.fillRect(0, 0, canvas.width, canvas.height);
const img = new Image();
img.src = "./assets/gcoin-1.gif";

const gravity = 0.2;
const coinsVelocities = new Array(8).fill({ x: 10, y: 10 });

const COLLISION = {
    onLeftPlate: {
        happend: false,
        by: [],
    },
    onNothing: {
        sprite: null,
        happend: false,
        by: []
    },
    onMainBar: {
        sprite: null,
        happend: false,
        by: []
    },
    onLeftPlate: {
        sprite: null,
        happend: false,
        by: []
    },
    onRightPlate: {
        sprite: null,
        happend: false,
        by: []
    },
    onPlatesBalancer: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoinStand: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoin1: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoin2: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoin3: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoin4: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoin5: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoin6: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoin7: {
        sprite: null,
        happend: false,
        by: []
    },
    onCoin8: {
        sprite: null,
        happend: false,
        by: []
    },
};

var collisionHappend = false;

function doCollision() {
    if (collisionHappend) {
        for (let [key, value] of Object.entries(COLLISION)) {
            if (value["happend"]) {
                value.by.forEach(sprite => {
                    if (value.sprite.position.y < value.sprite.limit.y)
                        value.sprite.unFreeze();
                    if (sprite.position.y < sprite.limit.y)
                        sprite.unFreeze();
                    // console.log(JSON.stringify(sprite));
                    sprite.addVelocity({ x: 0, y: 0 });
                    value.sprite.addVelocity({ x: 0, y: 0 });
                });
            }
        }
    }
}

const spritesSet = [
    {
        spriteName: "LeftPlate",
        x: (CENTER * 0.2),
        y: (CENTER * 2) - (CENTER * 0.5),
        width: (CENTER * 0.6),
        height: (CENTER * 0.02)
    },
    {
        spriteName: "RightPlate",
        x: CENTER + (CENTER * 0.2),
        y: (CENTER * 2) - (CENTER * 0.5),
        width: (CENTER * 0.6),
        height: (CENTER * 0.02)
    }
];
const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
}

var axis = {
    right:(CENTER * 2) - 100,
    left:(CENTER * 2) - 100
}

class Sprite {
    constructor({ shape, position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.shape = shape;
        this.limit = {
            x: canvas.width,
            y: canvas.height
        };
        this.stageOneLimit = {
            ...this.limit
        };
        this.stageTwoLimit = {
            ...this.limit
        }
        this.currentStage = 0;
        this.freezeIt = true;
        this.keyName = "Nothing";
        this.stageNotChanged = true;
        this.stages = {
            1: true,
            2: false
        };
        this.direction = "stable";
        this.nextMove = true;
    }

    unFreeze() {
        this.freezeIt = false;
    }
    freeze() {
        this.freezeIt = true;
    }
    draw() {
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.shape.width, this.shape.height);
    }
    update() {
        this.draw();
    }
    setBoundary({ x, y }) {
        this.limit.x = x;
        this.limit.y = y;
    }
    upLift(y) {
        this.limit.y = this.position.y - y;
        axis.right = rightPlate.limit.y;
        axis.left = leftPlate.limit.y;
        this.direction = "up";
        this.unFreeze();
        if (this.keyName == "RightPlate") {
            platec.right.forEach(e => {
                coins[e].upLift(y);
                // coins[e].setBoundary(rightPlate.limit);
                coins[e].setBoundary({...coins[e].limit,y:axis.right});
            });
            platec.left.forEach(e => {
                coins[e].downLift(y);
                coins[e].setBoundary({...coins[e].limit,y:axis.left});
            });
        } else if (this.keyName == "LeftPlate") {
            platec.right.forEach(e => {
                coins[e].downLift(y);
                coins[e].setBoundary({...coins[e].limit,y:axis.right});
            });
            platec.left.forEach(e => {
                coins[e].upLift(y);
                coins[e].setBoundary(leftPlate.limit);
            });
        }
    }
    downLift(y) {
        this.limit.y = this.position.y + y;
        axis.right = rightPlate.limit.y;
        axis.left = leftPlate.limit.y;
        this.direction = "down";
        this.unFreeze();
        if (this.keyName == "RightPlate") {
            platec.right.forEach(e => {
                coins[e].downLift(y);
                coins[e].setBoundary({...coins[e].limit,y:axis.right});
            });
            platec.left.forEach(e => {
                coins[e].upLift(y);
                coins[e].setBoundary({...coins[e].limit,y:axis.left});
            });
        } else if (this.keyName == "LeftPlate") {
            platec.right.forEach(e => {
                coins[e].upLift(y);
                coins[e].setBoundary({...coins[e].limit,y:axis.right});
            });
            platec.left.forEach(e => {
                coins[e].downLift(y);
                coins[e].setBoundary({...coins[e].limit,y:axis.left});
            });
        }
    }
    addVelocity(velocity) {
        this.velocity.x += velocity.x;
        this.velocity.y += velocity.y;
    }
    checkAndChangeItToStageTwo() {
    }
}
class Coin extends Sprite {

    constructor(props) {
        super(props);
        this.freezeIt = false;
    }

    draw() {
        c.drawImage(img, this.position.x, this.position.y, this.shape.width, this.shape.height);
    }

    update() {
        this.draw();
        this.checkAndChangeItToStageTwo();
        if (this.direction == "down") {
            if (!this.freezeIt) {
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                if (((this.position.y + this.shape.height) >= this.limit.y)) {
                    this.velocity.y = 0;
                    this.freeze();
                    this.direction = "reached";
                } else {
                    this.velocity.y += gravity;
                }
                if (this.position.x + this.shape.width >= this.limit.x) {
                    this.velocity.x = 0;
                } else {
                    this.velocity.x += gravity;
                }
            }
        } else if (this.direction == "up") {
            if (!this.freezeIt) {
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                if (((this.position.y + this.shape.height) <= this.limit.y)) {
                    this.velocity.y = 0;
                    this.freeze();
                    this.direction = "reached";
                } else {
                    this.velocity.y -= gravity;
                }
                if (this.position.x + this.shape.width <= this.limit.x) {
                    this.velocity.x = 0;
                } else {
                    this.velocity.x -= gravity;
                }
            }
        }
    }
}

class Plate extends Sprite {
    constructor(props) {
        super(props);
        this.freezeIt = true;
        this.stageTwoLimit = {
            x: this.limit.x,
            y: (CENTER * 2) - 100
        };
    }
    update() {
        this.draw();
        if (this.direction == "down") {
            if (!this.freezeIt) {
                this.position.y += this.velocity.y;
                if (((this.position.y + this.shape.height) >= this.limit.y)) {
                    this.velocity.y = 0;
                    this.freeze();
                    this.direction = "reached";
                } else {
                    this.velocity.y += gravity;
                }
            }
        } else {
            if (!this.freezeIt) {
                // this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                if (((this.position.y + this.shape.height) <= this.limit.y)) {
                    this.velocity.y = 0;
                    this.freeze();
                    this.direction = "reached";
                } else {
                    this.velocity.y -= gravity;
                }

            }
        }
    }

}

const coinShape = {
    width: (((0.95 / 8) - (0.04)) * (CENTER * 2)),
    height: (((0.95 / 8) - (0.05)) * (CENTER * 2))
};

const coins = new Array(8).fill(0).map((_, i) => {
    _ = new Coin({
        position: {
            x: ((i + 1) * (0.1 * CENTER * 2)),
            y: ((0.042) * (CENTER * 2))
        },
        velocity: {
            x: 0,
            y: 0
        },
        shape: coinShape
    });

    _.unFreeze();

    _.keyName = `Coin${i + 1}`;

    if (i < 6)
        _.setBoundary({
            x: (CENTER * 0.36),
            y: (CENTER * 2) - (CENTER * 0.5)
        });

    if (i > 2 && i < 6)
        _.setBoundary({
            x: ((i - 2) * (0.1 * CENTER * 2)) + (CENTER + (CENTER * 0.2)),
            y: (CENTER * 2) - (CENTER * 0.5)
        });

    _.stageTwoLimit = {
        x: _.limit.x,
        y: (CENTER * 2) - 100
    };

    if (i >= 0)
        _.freeze();
    else {
        _.direction = "down";
    }

    return _;
});

const mainBar = new Sprite({
    position: {
        x: CENTER - (CENTER * 0.025),
        y: CENTER - Math.floor(CENTER * (50 / 100))
    },
    shape: {
        width: (CENTER * 0.05),
        height: CENTER + (CENTER * 0.20)
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const platesBalancer = new Sprite({
    position: {
        x: CENTER / 2,
        y: (CENTER / 2) + (CENTER * 0.12)
    },
    shape: {
        width: CENTER,
        height: (CENTER * 0.03)
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const leftPlate = new Plate({
    position: {
        x: (CENTER * 0.2),
        y: (CENTER * 2) - (CENTER * 0.5)
    },
    shape: {
        width: (CENTER * 0.6),
        height: (CENTER * 0.02)
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const rightPlate = new Plate({
    position: {
        x: CENTER + (CENTER * 0.2),
        y: (CENTER * 2) - (CENTER * 0.5)
    },
    shape: {
        width: (CENTER * 0.6),
        height: (CENTER * 0.02)
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const coinStand = new Sprite({
    position: {
        x: ((0.025) * (CENTER * 2)),
        y: ((0.025) * (CENTER * 2))
    },
    shape: {
        width: ((0.95) * (CENTER * 2)),
        height: ((0.10) * (CENTER * 2))
    },
    velocity: {
        x: 0,
        y: 0
    }
});

rightPlate.keyName = "RightPlate";
leftPlate.keyName = "LeftPlate";
document.getElementById("b").onclick = function () {
    coins[parseInt(document.getElementById("i").value)].unFreeze();
    coins[parseInt(document.getElementById("i").value)].direction = "down";
    console.log("----------------------------");
    coins.forEach(e=>console.log(e.keyName+" "+JSON.stringify(e.position)));
}

var platec = {
    left: [],
    right: []
};

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    mainBar.update();
    platesBalancer.update();
    leftPlate.update();
    rightPlate.update();
    coinStand.update();
    coins.forEach(coin => {
        coin.update();
        if (coin.direction == "reached" && coin.nextMove) {
            console.log("stage 2");
            // coin.downLift(50);
            coin.nextMove = !coin.nextMove;
            let coinNumber = parseInt(coin.keyName.substring(coin.keyName.length - 1))
            if (coinNumber > 3) {
                if (platec.right.indexOf(coinNumber - 1) == -1)
                    platec.right.push(coinNumber - 1);
                rightPlate.downLift(50);
                leftPlate.upLift(50);

            } else {
                if (platec.left.indexOf(coinNumber - 1) == -1)
                    platec.left.push(coinNumber - 1);
                rightPlate.upLift(50);
                leftPlate.downLift(50);
            }
        }
    });
}

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp": keys.ArrowUp = true;
            break;
        case "ArrowDown": keys.ArrowDown = true;
            break;
        case "ArrowLeft": keys.ArrowLeft = true;
            break;
        case "ArrowRight": keys.ArrowRight = true;
            break;
    }
});

animate();
