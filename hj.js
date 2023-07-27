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
        this.direction = "stable";
        this.nextMove = true;
        this.img = img;
        this.src = src;
    }

    unFreeze() {
        this.freezeIt = false;
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
            this.limit.y = this.limit.y - y - (leftPlate.shape.height / 2);
        } else
            this.limit.y = this.position.y - y - (this.shape.height / 2);

        this.direction = "up";
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
        this.direction = "down";
        this.unFreeze();
        if (this.keyName == "RightPlate") {
            platesBalancer.rotateClockWise(7);
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
                coins[e].upLift(y);
                coins[e].setBoundary({ ...coins[e].limit, y: axis.right });
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
    }

    draw() {
        c.drawImage(img, this.position.x, this.position.y, this.shape.width, this.shape.height);
    }

    update() {
        this.draw();
        this.checkAndChangeItToStageTwo();
        if (this.direction == "down") {
            if (!this.freezeIt) {
                if (this.keyName != "Coin7") {
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
                } else {




                    this.position.x += this.velocity.x;
                    this.position.y += this.velocity.y;
                    if (((this.position.y + this.shape.height) >= this.limit.y)) {
                        console.log((this.position.y + this.shape.height) +" = "+ this.limit.y);
                        this.velocity.y = 0;
                        this.freeze();
                        this.direction = "reached";
                    } else {
                        this.velocity.y += gravity;
                    }
                    if (this.position.x - this.shape.width <= this.limit.x) {
                        this.velocity.x = 0;
                    } else {
                        this.velocity.x -= gravity;
                    }




                }
            }
        } else if (this.direction == "up") {
            if (!this.freezeIt) {
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                if (((this.position.y +this.shape.height) <= this.limit.y)) {
                    if(isStartOver){
                        this.position.y = this.limit.y;
                    }
                    this.velocity.y = 0;
                    this.freeze();
                    this.direction = "reached";
                } else {
                    this.velocity.y -= gravity;
                }
                if (this.position.x + this.shape.width >= this.limit.x) {
                    if(isStartOver){
                        this.position.x = this.limit.x;
                    }
                    this.velocity.x = 0;
                } else {
                    if(this.keyName == "Coin7")
                    console.log(this.position.x+" "+this.limit.x +" "+(this.position.x + this.shape.width >= this.limit.x));
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
            if (this.direction == "clockwise") {
                if (this.angle <= this.limit.angle) {
                    this.angle += (gravity);
                } else {
                    this.freeze();
                }
            } else {
                // console.log(this.angle);
                if ((this.angle >= this.limit.angle)) {
                    this.angle -= (gravity);
                } else {
                    this.freeze();
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
    coins[index].unFreeze();
    coins[index].direction = "down";
    if (index < 3 || index == 6)
        coins[index].setBoundary({ y: leftPlate.position.y, x: coins[index].limit.x });
    else
        coins[index].setBoundary({ y: rightPlate.position.y, x: coins[index].limit.x });

}



rightPlate.keyName = "RightPlate";
leftPlate.keyName = "LeftPlate";
var isStartOver = false;
document.getElementById("ii").addEventListener("click", () => {
    coins.forEach((c, i) => {
        c.setBoundary({
            x: (positions.coin.x * (i + 1)),
            y: positions.coin.y
        });
        c.direction = "up";
        c.unFreeze();
    });
    isStartOver = true;
    leftPlate.position = positions.left;
    rightPlate.position = positions.right;
    platesBalancer.angle = 0;
});
document.getElementById("b").onclick = temp;

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

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.clearRect(0, 0, canvas.width, canvas.height);
    mainBar.update();
    platesBalancer.update();

    coinStand.update();
    coins.forEach(coin => {
        coin.update();
        if (!isStartOver) {

            if (coin.direction == "reached" && coin.nextMove) {
                console.log("stage 2");
                // coin.downLift(50);
                coin.nextMove = !coin.nextMove;
                let coinNumber = parseInt(coin.keyName.substring(coin.keyName.length - 1))
                if (coinNumber > 3 && coinNumber != 7) {
                    if (platec.right.indexOf(coinNumber - 1) == -1)
                        platec.right.push(coinNumber - 1);
                    rightPlate.downLift(inc);
                    leftPlate.upLift(inc);

                } else {
                    if (platec.left.indexOf(coinNumber - 1) == -1)
                        platec.left.push(coinNumber - 1);
                    rightPlate.upLift(inc);
                    leftPlate.downLift(inc);
                }
            }
        }
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

function change() {
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
}