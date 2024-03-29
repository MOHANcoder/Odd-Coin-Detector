const canvas = document.querySelector("canvas");
const canvasContainer = document.querySelector(".canvas-container");
const c = canvas.getContext("2d");
const minimumWindowSize = Math.min(window.innerWidth, window.innerHeight);
canvas.width = canvas.height = minimumWindowSize - (minimumWindowSize * (0.2));

const CENTER = canvas.width / 2;

const imgarr = [
    "./assets/plate.png",
    "./assets/mainbar.png",
    "./assets/coin.png"
]

c.fillRect(0, 0, canvas.width, canvas.height);
c.fillStyle = "white";
const img = new Image();
img.src = imgarr[2];

const gravity = 0.2;
const coinsVelocities = new Array(8).fill({ x: 10, y: 10 });

const inc = CENTER * 0.1;

const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
}

var axis = {
    right: (CENTER * 2) - 100,
    left: (CENTER * 2) - 100
}

class Sprite {
    constructor({ shape, position, velocity, img, src }) {
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
        this.direction = {
            x: "stable",
            y: "stable"
        };
        this.nextMove = true;
        this.img = img;
        this.src = src;
        this.mass = 0.0;
    }

    unFreeze() {
        this.freezeIt = false;
        // console.log(this.keyName+"UNFREEZED");
    }
    freeze() {
        this.freezeIt = true;
    }
    draw() {
        c.fillStyle = "blue";
        if (!this.img)
            c.fillRect(this.position.x, this.position.y, this.shape.width, this.shape.height);
        else {
            this.img.src = this.src;
            c.drawImage(this.img, this.position.x, this.position.y, this.shape.width, this.shape.height);
        }
    }
    update() {
        this.draw();
    }
    setBoundary({ x, y }) {
        this.limit.x = x;
        this.limit.y = y;
    }
    upLift(y) {
        y /= 2;
        if (this.keyName.startsWith("Coin")) {
            // console.log(this.limit.y + " " + (this.position.y - y - (CENTER * 0.02)) + " " + (this.position.y));
            // this.limit.y = this.limit.y - (y*2) - (leftPlate.shape.height);
            if (this.lastMove == "right")
                this.limit.y = this.position.y - y - (CENTER * 0.02);
            else
                this.limit.y = this.position.y - y - (CENTER * 0.02);
        } else
            this.limit.y = this.position.y - y - (this.shape.height / 2);

        this.direction.y = "up";
        this.unFreeze();
        if (this.keyName == "RightPlate") {
            axis.right = rightPlate.limit.y;
        } else if (this.keyName == "LeftPlate") {
            axis.left = leftPlate.limit.y;
        }
    }
    downLift(y) {
        if (this.keyName.startsWith("Coin")) {
            this.limit.y = this.limit.y + y;
        } else
            this.limit.y = this.position.y + (y - this.shape.height);
        // axis.right = rightPlate.limit.y;
        // axis.left = leftPlate.limit.y;
        this.direction.y = "down";
        this.unFreeze();
        if (this.keyName == "RightPlate") {
            platesBalancer.rotateClockWise(7);
            // platesBalancer.freeze();
            axis.right = rightPlate.limit.y;
            platec.right.forEach(e => {
                coins[e].downLift(y);
                coins[e].setBoundary({ ...coins[e].limit, y: axis.right });
            });
            platec.left.forEach(e => {
                coins[e].setBoundary({ ...coins[e].limit, y: axis.left });
                coins[e].upLift(y);
            });
        } else if (this.keyName == "LeftPlate") {
            platesBalancer.rotateAntiClockWise(7);
            axis.left = leftPlate.limit.y;
            platec.right.forEach(e => {
                coins[e].setBoundary({ ...coins[e].limit, y: axis.right });
                coins[e].upLift(y);
            });
            platec.left.forEach(e => {
                coins[e].downLift(y);
                coins[e].setBoundary({ ...coins[e].limit, y: axis.left });
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
        this.lastMove = this.direction.x;
        this.direction = {
            x: "stable",
            y: "stable"
        };
        this.currentStage = "first";
        this.keyNumber = null;
        this.flag0 = false;
    }

    draw() {
        c.drawImage(img, this.position.x, this.position.y, this.shape.width, this.shape.height);
    }

    update() {
        this.draw();
        this.checkAndChangeItToStageTwo();
        this.flag0 = false;
        if (!this.freezeIt) {
            switch (this.direction.y) {
                case "up":
                    if ((this.position.y) >= this.limit.y) {
                        this.velocity.y -= gravity;
                        this.flag0 = true;
                        // console.log(this.keyName+" "+flag);
                    } else {
                        this.velocity.y = 0;
                        // console.log("NO" + this.position.y);
                        if (isStartOver) {
                            this.position.y = this.limit.y;
                            // this.freeze();
                        }
                        // this.freeze();
                    }
                    break;
                case "down":
                    if ((this.position.y + this.shape.height) <= this.limit.y) {
                        this.velocity.y += gravity;
                        this.flag0 = true;
                        // console.log(this.keyName+" "+flag);
                    } else {
                        this.velocity.y = 0;
                        // console.log("NO" + this.position.y);
                        if (isStartOver) {
                            this.position.y = this.limit.y;
                            // this.freeze();
                        }
                        // this.freeze();
                    }
                    break;
            }

            switch (this.direction.x) {
                case "left":
                    if (this.position.x >= this.limit.x) {
                        this.velocity.x -= gravity;
                        this.flag0 = true;
                        // console.log(this.keyName+" "+flag);
                    } else {
                        this.velocity.x = 0;
                        // console.log("NO" + this.position.x);
                        if (isStartOver) {
                            this.position.x = this.limit.x;
                            // this.freeze();
                        }
                        // this.freeze();
                    }
                    break;
                case "right":
                    if ((this.position.x + this.shape.width) <= this.limit.x) {
                        this.velocity.x += gravity;
                        this.flag0 = true;
                        // console.log(this.keyName+" "+flag);
                    } else {
                        this.velocity.x = 0;
                        // console.log("NO" + this.position.x);
                        if (isStartOver) {
                            this.position.x = this.limit.x;
                            // this.freeze();
                        }
                        // this.freeze();
                    }
                    break;
            }

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if (!this.flag0 && this.currentStage == "first" && !isStartOver) {
                // console.log(!flag && this.currentStage == "first" && this.direction.x != "stable" && this.direction.y != "stable");
                this.freeze();
                // console.log(this.keyName);
                this.currentStage = "second";
                this.lastMove = this.direction.x;
                switch (this.direction.y) {
                    case "down":
                        switch (this.direction.x) {
                            case "left":
                                if (platec.left.indexOf(this.keyNumber) == -1)
                                    platec.left.push(this.keyNumber);
                                // console.log(JSON.stringify(rightPlate.position) + " " + JSON.stringify(positions.right))
                                rightPlate.upLift(this.mass / 100 * CENTER);
                                leftPlate.downLift(this.mass / 100 * CENTER);
                                break;
                            case "right":
                                if (platec.right.indexOf(this.keyNumber) == -1)
                                    platec.right.push(this.keyNumber);
                                // console.log("yes");
                                rightPlate.downLift(this.mass / 100 * CENTER);
                                leftPlate.upLift(this.mass / 100 * CENTER);
                                break;
                        }
                        break;
                    case "up":
                        switch (this.direction.x) {
                            case "left":
                                if (platec.left.indexOf(this.keyNumber) == -1)
                                    platec.left.push(this.keyNumber);
                                rightPlate.downLift(this.mass / 100 * CENTER);
                                leftPlate.upLift(this.mass / 100 * CENTER);
                                break;
                            case "right":
                                if (platec.right.indexOf(this.keyNumber) == -1)
                                    platec.right.push(this.keyNumber);
                                rightPlate.upLift(this.mass / 100 * CENTER);
                                leftPlate.downLift(this.mass / 100 * CENTER);
                                break;
                        }
                        break;
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
        props.img = new Image();
        props.img.src = imgarr[0];
        this.img = props.img;
    }

    draw() {
        c.drawImage(this.img, this.position.x - ((CENTER * 0.1)), this.position.y - (this.shape.height + CENTER * 0.7), this.shape.width + (CENTER * 0.2), this.shape.height + (CENTER));
        c.drawImage(img, this.position.x + ((CENTER * 0.2)), this.position.y - (this.shape.height + CENTER * 0.6), (CENTER * 0.2), (CENTER * 0.2));
    }

    update() {
        this.draw();
        if (!this.freezeIt) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            switch (this.direction.y) {
                case "down":
                    if (((this.position.y + this.shape.height) >= this.limit.y)) {
                        this.velocity.y = 0;
                        this.freeze();
                        this.direction.y = "reached";
                    } else {
                        this.velocity.y += gravity;
                    }
                    break;
                case "up":
                    if (((this.position.y + this.shape.height) <= this.limit.y)) {
                        this.velocity.y = 0;
                        this.freeze();
                        this.direction.y = "reached";
                    } else {
                        this.velocity.y -= gravity;
                    }
                    break;
            }
        }
    }
}

class PlatesBalancer extends Sprite {
    constructor(props) {
        super(props);
        this.freezeIt = true;
        this.angle = 0;
        this.limit = {
            angle: 0
        };
        this.img = new Image();
        this.img.src = "./assets/platesbalancer.png";
        this.state = {
            x: this.position.x + this.shape.width / 2,
            y: this.position.y + this.shape.height
        }
    }

    draw() {
        c.fillStyle = "gold";
        c.save();
        c.beginPath();
        c.translate((this.position.x + this.shape.width / 2), (this.position.y + this.shape.height / 2));
        c.rotate((this.angle) * (Math.PI / 180));
        // c.translate(-this.position.x+this.shape.width/2,-this.position.y+this.shape.height/2);
        //c.rect(-((this.shape.width / 2)+(CENTER*0.2)), -(this.shape.height-(CENTER*0.15)) , this.shape.width+(CENTER*0.4), this.shape.height+(CENTER*0.4));
        //c.rect(-((this.shape.width / 2)), -(this.shape.height) , this.shape.width, this.shape.height);
        // c.moveTo(-((this.shape.width / 2)), -(this.shape.height));
        // c.lineTo(-((this.shape.width / 2))-this.shape.width, -(this.shape.height)-this.shape.height);
        // c.drawImage(this.img,-this.state.x, -this.state.y , this.shape.width+(CENTER*0.4), this.shape.height+(CENTER*0.4));
        // c.strokeRect(-((this.shape.width / 2)+(CENTER*0.21)), -(this.shape.height-(CENTER*0.15)) , this.shape.width+(CENTER*0.4), this.shape.height+(CENTER*0.4));
        // c.fillRect(-this.state.x,-this.state.y,100,100);
        // c.translate(-(this.shape.width/2),-(this.shape.height/2));
        c.fillRect((-this.shape.width / 2), -(this.shape.height / 2), this.shape.width, this.shape.height);
        c.fill();
        // c.beginPath();
        // c.moveTo(this.position.x,this.position.y);
        // c.lineTo(this.position.x+this.shape.width,this.position.y);
        // c.lineTo(this.position.x+this.shape.width,this.position.y+this.shape.height);
        // c.lineTo(this.position.x,this.position.y+this.shape.height);
        // c.stroke();
        // c.fill();
        c.restore();
    }

    rotateClockWise(angle) {
        this.limit.angle += angle;
        this.direction = "clockwise";
        this.unFreeze();
        // console.log(coins[0]);
    }

    rotateAntiClockWise(angle) {
        // console.log(this.angle + " "+this.limit.angle);
        this.limit.angle -= angle;
        // console.log(this.angle + " after"+this.limit.angle);
        this.direction = "anticlockwise";
        this.unFreeze();
    }

    update() {
        this.draw();
        if (!this.freezeIt) {
            // console.log(this.direction);
            switch (this.direction) {
                case "clockwise":
                    if (this.angle <= this.limit.angle) {
                        this.angle += (gravity);
                    } else {
                        this.freeze();
                    }
                    break;
                case "anticlockwise":
                    if ((this.angle >= this.limit.angle)) {
                        this.angle -= (gravity);
                    } else {
                        this.freeze();
                    }
                    break;
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

    _.mass = 10;

    _.unFreeze();

    _.keyName = `Coin${i + 1}`;
    _.keyNumber = i;

    if (i < 3 || i == 6)
        _.setBoundary({
            x: (CENTER * 0.36),
            y: (CENTER * 2) - (CENTER * 0.5)
        });

    if ((i > 2 && i < 6))
        _.setBoundary({
            x: ((i - 2) * (0.1 * CENTER * 2)) + (CENTER + (CENTER * 0.2)),
            y: (CENTER * 2) - (CENTER * 0.5)
        });

    if (i == 7) {
        _.setBoundary({
            x: ((2) * (0.1 * CENTER * 2)) + (CENTER + (CENTER * 0.2)),
            y: (CENTER * 2) - (CENTER * 0.5)
        });
    }


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
        x: CENTER - (CENTER * 0.2),
        y: CENTER - Math.floor(CENTER * (50 / 100))
    },
    shape: {
        width: (CENTER * 0.4),
        height: CENTER + (CENTER * 0.50)
    },
    velocity: {
        x: 0,
        y: 0
    },
    img: new Image(),
    src: imgarr[1]
});

const platesBalancer = new PlatesBalancer({
    position: {
        x: (CENTER / 2) - (CENTER * 0.05),
        y: (CENTER / 2) + (CENTER * 0.45)
    },
    shape: {
        width: CENTER + (CENTER * 0.1),
        height: (CENTER * 0.03)
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const leftPlate = new Plate({
    position: {
        x: (CENTER * 0.18),
        y: (CENTER * 2) - (CENTER * 0.5)
    },
    shape: {
        width: (CENTER * 0.6),
        height: (CENTER * 0.02)
    },
    velocity: {
        x: 0,
        y: 0
    },
});

const rightPlate = new Plate({
    position: {
        x: CENTER + (CENTER * 0.22),
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


function temp() {
    let index = parseInt(document.getElementById("i").value);
    let d = document.getElementById("s").value;
    coins[index].unFreeze();
    coins[index].direction.y = "down";
    isStartOver = false;
    if (d == "left") {
        coins[index].direction.x = "left";
        coins[index].setBoundary({ y: leftPlate.position.y, x: (CENTER * 0.36) });
    }
    else {
        coins[index].direction.x = "right";
        // ((i - 2) * (0.1 * CENTER * 2)) + (CENTER + (CENTER * 0.2))
        coins[index].setBoundary({ y: rightPlate.position.y, x: ((2) * (0.1 * CENTER * 2)) + (CENTER + (CENTER * 0.2)) });
    }

}



rightPlate.keyName = "RightPlate";
leftPlate.keyName = "LeftPlate";
var isStartOver = false;
/*document.getElementById("ii").addEventListener("click", () => {
    coins.forEach((c, i) => {
        c.setBoundary({
            x: (positions.coin.x * (i + 1)),
            y: positions.coin.y
        });
        c.direction.y = "up";
        c.direction.x = "left";
        c.currentStage = "first";
        c.unFreeze();
    });
    platec.left = [];
    platec.right = [];
    isStartOver = true;
    leftPlate.direction = {
        x: 'stable', y: "stable"
    };
    rightPlate.direction = {
        x: "stable", y: "stable"
    };
    leftPlate.position.y = positions.left.y;
    rightPlate.position.y = positions.right.y;
    leftPlate.freeze();
    rightPlate.freeze();
    platesBalancer.freeze();
    platesBalancer.direction = "stable";
    platesBalancer.position = {
        x: (CENTER / 2) - (CENTER * 0.05),
        y: (CENTER / 2) + (CENTER * 0.45)
    };
    axis = {
        right: (CENTER * 2) - 100,
        left: (CENTER * 2) - 100
    };
    platesBalancer.angle = 0;
});
document.getElementById("b").onclick = temp;*/

var platec = {
    left: [],
    right: []
};

var positions = {
    left: {
        x: (CENTER * 0.18),
        y: (CENTER * 2) - (CENTER * 0.5)
    },
    right: {
        x: CENTER + (CENTER * 0.22),
        y: (CENTER * 2) - (CENTER * 0.5)
    },
    coin: {
        x: ((0.1 * CENTER * 2)),
        y: ((0.042) * (CENTER * 2))
    }
}

let nn = 0;
let afterStartOver = false;

function animate() {
    window.requestAnimationFrame(animate);
    nn = 0;
    c.fillStyle = "white";
    c.clearRect(0, 0, canvas.width, canvas.height);
    mainBar.update();
    coins.forEach(coin => {
        if (coin.position.y == coin.limit.y) {
            if (isStartOver) {
                coin.freeze();
                platesBalancer.freeze();
                platesBalancer.direction = "stable";
            }
        }
    });
    platesBalancer.update();

    //coinStand.update();
    coins.forEach(coin => nn += ((coin.freezeIt) ? 1 : 0));
    coins.forEach(coin => {
        if (coin.position.y == coin.limit.y) {
            if (isStartOver) {
                coin.freeze();
                platesBalancer.freeze();
                platesBalancer.direction = "stable";
                leftPlate.freeze();
                rightPlate.freeze();
                afterStartOver = true;
            }
        }
        coin.update();
    });
    leftPlate.update();
    rightPlate.update();
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

/*function change() {
    let value = 0;
    let t =
        setInterval(() => {
            if (value > 7)
                clearInterval(t);
            else {
                document.getElementById("i").value = value++;
                temp();
            }
        }, 2000);
}*/

function callCoins(a, b) {
    let nums = 1;
    a.forEach((c) => {
        setTimeout(() => {
            coins[c].unFreeze();
            coins[c].direction.y = "down";
            coins[c].direction.x = "left";
            coins[c].setBoundary({ y: leftPlate.position.y, x: (CENTER * 0.36) });
        }, nums++*2000);
    });
   // setTimeout(()=>{
b.forEach(c => {
        setTimeout(() => {
            coins[c].unFreeze();
            coins[c].direction.y = "down";
            coins[c].direction.x = "right";
            coins[c].setBoundary({ y: rightPlate.position.y, x: ((2) * (0.1 * CENTER * 2)) + (CENTER + (CENTER * 0.2)) });
        }, nums++*2000);
    });
    isStartOver = false;
}

function reStart() {
    coins.forEach((c, i) => {
        c.setBoundary({
            x: (positions.coin.x * (i + 1)),
            y: positions.coin.y
        });
        c.direction.y = "up";
        c.direction.x = "left";
        c.currentStage = "first";
        c.unFreeze();
    });
    platec.left = [];
    platec.right = [];
    isStartOver = true;
    leftPlate.direction = {
        x: 'stable', y: "stable"
    };
    rightPlate.direction = {
        x: "stable", y: "stable"
    };
    leftPlate.position.y = positions.left.y;
    rightPlate.position.y = positions.right.y;
    leftPlate.freeze();
    rightPlate.freeze();
    platesBalancer.freeze();
    platesBalancer.direction = "stable";
    platesBalancer.position = {
        x: (CENTER / 2) - (CENTER * 0.05),
        y: (CENTER / 2) + (CENTER * 0.45)
    };
    axis = {
        right: (CENTER * 2) - 100,
        left: (CENTER * 2) - 100
    };
    platesBalancer.angle = 0;
}