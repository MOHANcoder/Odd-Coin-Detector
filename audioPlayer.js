var A = 0, B = 1, C = 2, D = 3, E = 4, F = 5, G = 6, H = 7;

let eight_coins = coinsarr;

function sum(s) {
    //console.log(s);
    let sum = 0;
    for (let i of s) sum += eight_coins[i];
    return sum;
}

let box = document.getElementById("cs");

function f(t1, t2, m1, m2, m3) {
    return new Promise(function (resolve, reject) {
        let l = t1.length+t2.length;
        callCoins(t1,t2);
        setTimeout(

            () => {
                if (sum(t1) > sum(t2)) {
                    box.innerHTML = (m1);
                    reStart();
                    setTimeout(()=>resolve(1),2000);
                } else if (sum(t1) < sum(t2)) {
                    box.innerHTML = (m2);
                    reStart();
                    setTimeout(()=>resolve(2),2000);
                } else {
                    box.innerHTML = (m3);
                    reStart();
                    setTimeout(()=>resolve(3),2000);
                }
            }
            ,
            (l+1)*2000
        );
    })
}


function f2(t1, t2, m1, m2) {
    return new Promise(function (resolve, reject) {
        let l = t1.length+t2.length;
        callCoins(t1,t2);
        setTimeout(
            
            () => {
                if (sum(t1) > sum(t2)) {
                    box.innerHTML = (m1);
                    reStart();
                    setTimeout(()=>resolve(1),2000);
                } else if (sum(t1) == sum(t2)) {
                    box.innerHTML = (m2);
                    reStart();
                    setTimeout(()=>resolve(2),2000);
                }
            }
            ,
            (l+1)*2000
        );
    })
}

function startAction(){
    f([A, B, C], [D, E, F], "The Selected Coin might be in the coins A,B,C,D,E,F",  "The Selected Coin might be in the coins A,B,C,D,E,F","The Selected Coin might be in the coins G or H")
    .then((r) => {
        if (r == 1) {

            f([A, D], [B, E], "The Selected Coin might be either A or E", "The Selected Coin might be either B or D", "The Selected Coin might be either C or F").then(
                (r) => {
                    if (r == 1) {
                        f2([A], [B], "Result: Coin A is the Heaviest Coin", "Result: Coin E is the Lightest Coin");
                    } else if (r == 2) {
                        f2([B], [A], "Result: Coin B is the Heaviest Coin", "Result: Coin D is the Lightest Coin");
                    } else if (r == 3) {
                        f2([C], [A], "Result: Coin C is the Heaviest Coin", "Result: Coin F is the Lightest Coin");
                    }
                }
            )

        } else if (r == 2) {
            f([A, D], [B, E], "The Selected Coin might be either B or D", "The Selected Coin might be either A or E", "The Selected Coin might be either C or F").then(
                (r) => {
                    if (r == 1) {
                        f2([A], [B], "Result: Coin B is the Lightest Coin", "Result: Coin D is the Heaviest Coin");
                    } else if (r == 2) {
                        f2([B], [A], "Result: Coin A is the Lightest Coin", "Result: Coin E is the Heaviest Coin");
                    } else if (r == 3) {
                        f2([A], [C], "Result: Coin C is the Lightest Coin", "Result: Coin F is the Heaviest Coin");
                    }
                }
            )
        } else if (r == 3) {
            f([G], [H], "The Coin G might be heavy or Coin H is light", "The Coin H might be heavy or Coin G is light").then(
                (r) => {
                    if (r == 1) {
                        f2([G], [A], "Result: Coin G is the Heaviest Coin", "Result: Coin H is the Lightest Coin");
                    } else if (r == 2) {
                        f2([H], [A], "Result: Coin H is the Heaviest Coin", "Result: Coin G is the Lightest Coin");
                    }
                }
            );
        }
    });
}