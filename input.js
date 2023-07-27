const coinsarr = [];
function fieldCheck() {
    var m = document.getElementById("coinweigh").value;
    var n = document.getElementById("newcoinweigh").value;
    if (m == null || n == null || m == "" || n == "") {
        alert("Fill the empty fields");
        return false;
    }
    else {
        validateValue();
        return true;
    }
}
function validateValue() {
    var m = parseInt(document.getElementById("coinweigh").value);
    var n = parseInt(document.getElementById("newcoinweigh").value);
    if (m < 1 || n < 1) {
        alert("Enter Positive Number for Weights!");
        return false;
    }
    else {
        storeValue();
        return true;
    }
}

var normalWeight,isinc = false,str1;
function storeValue() {
    let x = parseInt(document.getElementById("coinweigh").value);
    for (let i = 0; i < 8; i++)
        coinsarr.push(x);
    str1 = document.getElementById("chwg").value;
    var a = parseInt(document.getElementById("chcoin").value);
    var ncwg = parseInt(document.getElementById("newcoinweigh").value);
    var comp = str1.localeCompare("increase");
    if (comp == 0) {
        coinsarr[a - 1] = coinsarr[a - 1] + ncwg;
        isinc = true;
    }
    else {
        coinsarr[a - 1] = coinsarr[a - 1] - ncwg;
    }
    console.log(coinsarr);
document.body.classList.add("main");
document.getElementById("mycanvas").style.display = "block";

document.querySelector(".current-state").style.display = "block";

document.querySelector(".info-box").style.display = "none";
    startAction();
    // change();
} 