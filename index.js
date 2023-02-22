const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = canvas.height = Math.min(window.innerWidth, window.innerHeight) - 10;

const CENTER = canvas.width / 2;

c.fillRect(0, 0, canvas.width, canvas.height);
const img = new Image();
img.src = "./assets/coin.png";

const gravity = 0.2;
const coinsVelocities = new Array(8).fill({ x: 10, y: 10 });

const inc = CENTER*0.1;

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
    constructor({ shape, position, velocity ,img,src}) {
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
        if(!this.img)
        c.fillRect(this.position.x, this.position.y, this.shape.width, this.shape.height);
        else{
            this.img.src = this.src;
        c.drawImage(this.img, this.position.x, this.position.y, this.shape.width, this.shape.height);}
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
            platesBalancer.rotateClockWise(10);
            axis.right = rightPlate.limit.y;
            platec.right.forEach(e => {
                coins[e].downLift(y);
                coins[e].setBoundary({...coins[e].limit,y:axis.right});
            });
            platec.left.forEach(e => {
                coins[e].setBoundary({...coins[e].limit,y:axis.left});
                coins[e].upLift(y);
            });
        } else if (this.keyName == "LeftPlate") {
            platesBalancer.rotateAntiClockWise(10);
            axis.left = leftPlate.limit.y;
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
                // if (this.position.x + this.shape.width <= this.limit.x) {
                //     this.velocity.x = 0;
                // } else {
                //     this.velocity.x -= gravity;
                // }
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
        props.img.src = "./assets/plate.png";
        this.img = props.img;
    }

    draw(){
        c.drawImage(this.img, this.position.x-((CENTER*0.20)), this.position.y-(this.shape.height+CENTER*0.7), this.shape.width+(CENTER*0.2), this.shape.height+(CENTER));
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
    }

    draw() {
        c.fillStyle = "blue";
        c.save();
        c.beginPath();
        c.translate(this.position.x + this.shape.width / 2, this.position.y + this.shape.height);
        c.rotate((this.angle) * (Math.PI / 180));
        // c.translate(-this.position.x+this.shape.width/2,-this.position.y+this.shape.height/2);
        c.rect(-this.shape.width / 2, -this.shape.height , this.shape.width, this.shape.height);
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
        this.limit.angle = -(Math.abs(this.limit.angle)+angle);
        this.direction = "anticlockwise";
        this.unFreeze();
    }

    update() {
        this.draw();
        if (!this.freezeIt) {
            if (this.direction == "clockwise") {
                if (this.angle < this.limit.angle) {
                    this.angle += gravity;
                } else {
                    this.freeze();
                }
            }else{
                if (this.angle > this.limit.angle) {
                    this.angle -= gravity;
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
    img:new Image(),
    src:"./assets/mainbar.png"
});

const platesBalancer = new PlatesBalancer({
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
    },
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
    let index = parseInt(document.getElementById("i").value);
    coins[index].unFreeze();
    coins[index].direction = "down";
    if(index <3)
    coins[index].setBoundary({y:leftPlate.position.y,x:coins[index].limit.x});
    else
    coins[index].setBoundary({y:rightPlate.position.y,x:coins[index].limit.x});
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
                rightPlate.downLift(inc);
                leftPlate.upLift(inc);

            } else {
                if (platec.left.indexOf(coinNumber - 1) == -1)
                    platec.left.push(coinNumber - 1);
                rightPlate.upLift(inc);
                leftPlate.downLift(inc);
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
