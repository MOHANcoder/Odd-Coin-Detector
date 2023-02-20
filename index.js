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

    upLift(y){
        console.log(this.position.y+" "+this.limit.y);
        this.limit.y=this.position.y-y;
        this.addVelocity({x:0,y:-5});
        this.unFreeze();
        this.stageNotChanged = false;
        console.log(this.position.y+" "+this.limit.y);
    }

    addVelocity(velocity) {
        this.velocity.x += velocity.x;
        this.velocity.y += velocity.y;
    }

    checkAndChangeItToStageTwo() {
        // console.log(`${(this.position.x+this.velocity.x)} , ${this.limit.x} ,${(this.position.y+this.velocity.y)} , ${this.limit.y}`);
        // console.log((this.position.y+this.velocity.y) >= this.limit.y);
        if(this.stageNotChanged)
        {if (((this.position.y + this.shape.height) >= this.limit.y)) {
            console.log(this.keyName);
            this.setBoundary(this.stageTwoLimit);
            this.currentStage = 2;
            this.unFreeze();
        }}else{
            this.upLift(100);
        }
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
        if (!this.freezeIt) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            if (((this.position.y + this.shape.height) >= this.limit.y)) {
                this.velocity.y = 0;
                this.freeze();
            } else {
                this.velocity.y += gravity;
            }
            if (this.position.x + this.shape.width >= this.limit.x) {
                this.velocity.x = 0;
            } else {
                this.velocity.x += gravity;
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
        if (!this.freezeIt) {
            this.checkAndChangeItToStageTwo();
            // this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            if (((this.position.y + this.shape.height) >= this.limit.y)) {
                this.velocity.y = 0;
                this.freeze();
            } else {
                this.velocity.y += gravity;
            }
            // if (this.position.x + this.shape.width >= this.limit.x) {
            //     this.velocity.x = 0;
            // } else {
            //     this.velocity.x += gravity;
            // }
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

    if (i != 1)
        _.freeze();

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

// leftPlate.unFreeze();

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
        if (coin.currentStage == 2) {
            
            let coinNumber = parseInt(coin.keyName.substring(coin.keyName.length - 1))
            if (coinNumber > 4) {
                if (rightPlate.currentStage != 2) {
                    rightPlate.unFreeze();
                    rightPlate.setBoundary(rightPlate.stageTwoLimit);
                    rightPlate.currentStage = 2;
                    leftPlate.upLift(100);
                }
            }else{
                if (leftPlate.currentStage != 2) {
                    leftPlate.unFreeze();
                    leftPlate.setBoundary(leftPlate.stageTwoLimit);
                    leftPlate.currentStage = 2;
                    rightPlate.upLift(100);
                }
            }
        }
    });
    // doCollision();
    // coin.velocity = {x:0,y:0};
    // if(keys.ArrowUp){
    //     coin.velocity.y = -1;
    // }else if(keys.ArrowDown){
    //     coin.velocity.y = 1;
    // }
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