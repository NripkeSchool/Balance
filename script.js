var board = [];
const colors = [
    '#1AFF00',
    '#27FF00',
    '#34FF00',
    '#41FF00',
    '#4EFF00',
    '#5BFF00',
    '#68FF00',
    '#75FF00',
    '#82FF00',
    '#8FFF00',
    '#9CFF00',
    '#A9FF00',
    '#B6FF00',
    '#C3FF00',
    '#D0FF00',
    '#DDFF00',
    '#EAFF00',
    '#F7FF00',
    '#FFFF00',  // Transition
    '#FFD200',
    '#FFA500',
    '#FF7800',
    '#FF4B00',
    '#FF1E00',
    '#FF0000'
  ]//Helpful array for determining what color each weight should be

var torqueX = 0;
var torqueY = 0;
var currentMove = 1;
var pivotPoint = 12;
var maxTorque = 10;
var blockOrder = [];
function loadBoard()
{
    /* Later this will be PHP*/

    for (var i = 0; i<25; i++)
    {
        board[i] = 0; //Math.floor(Math.random() * 25)+1
    }

    computeTorque();

    for (var i = 0; i<25; i++)
    {
        updateSquare(i, board[i])
    }

    for (var i = 0; i<25; i++)
    {
        blockOrder[i] = i+1;
    }

    document.getElementById("np1").textContent = blockOrder[currentMove-1];
    document.getElementById("np1").style.background = colors[blockOrder[currentMove-1]];

    document.getElementById("np2").textContent = blockOrder[currentMove];
    document.getElementById("np2").style.background = colors[blockOrder[currentMove]];
}

function getRow(box)
{
    return Math.floor(box/5);
}

function getCol(box)
{
    return box % 5;
}

function cT(id)
{
    board[id] = blockOrder[currentMove-1];
    torqueX = 0;
    torqueY = 0;

    for (var i = 0; i<25; i++)
    {
        var xRadius = getCol(i) - getCol(pivotPoint);
        var yRadius = getRow(pivotPoint)-getRow(i);
        torqueX += xRadius*board[i];
        torqueY += yRadius*board[i];
    }
    
    board[id] = 0;

    var largeTorque = 0;

    if (Math.abs(torqueX) > Math.abs(torqueY)) {largeTorque=Math.abs(torqueX);}else {largeTorque=Math.abs(torqueY);}
    return largeTorque;
}

function computeTorque()
{
    /*
        Defining torque directions similar to cartesian-coordinate quadrants

        The equation for torque = radius*force

        Thus find x and y radii, and multiply by the weight to obtain corresponding x and y torque
    */
    torqueX = 0;
    torqueY = 0;

    for (var i = 0; i<25; i++)
    {
        var xRadius = getCol(i) - getCol(pivotPoint);
        var yRadius = getRow(pivotPoint)-getRow(i);
        torqueX += xRadius*board[i];
        torqueY += yRadius*board[i];
    }

    console.log("X-Torque: " + torqueX);
    console.log("Y-Torque: " + torqueY);

    var largeTorque = 0;

    if (Math.abs(torqueX) > Math.abs(torqueY)) {largeTorque=Math.abs(torqueX);}else {largeTorque=Math.abs(torqueY);}

    document.getElementById("progressBar").style.width = (largeTorque/maxTorque)*100 + "%";
    document.getElementById("progressBar").textContent = Math.floor((largeTorque/maxTorque)*100) + "%";
}

function updateSquare(id, weight)
{
    document.getElementById(id).textContent = weight;
    document.getElementById(id).style.background = colors[weight-1];
    board[id] = weight;
}

function testButton(id)
{
    if (board[id] != 0) {return;}

    var element = document.getElementById(id);
    if (element.classList.contains("incorrectSpot")) {element.classList.remove("incorrectSpot");}
    if (element.classList.contains("validSpot")) {element.classList.remove("validSpot");}

    void element.offsetWidth;

    if (cT(id) > maxTorque) {element.classList.add("incorrectSpot"); return;}

    makeMove(id);
    
    element.classList.add("validSpot");
}

function makeMove(id)
{
    var weight = blockOrder[currentMove-1]; //Get current block
    updateSquare(id, weight);

    currentMove++;
    maxTorque = 10 + currentMove/2;
    
    computeTorque();

    // Update the "Next-Move" icons
    document.getElementById("np1").textContent = blockOrder[currentMove-1];
    document.getElementById("np1").style.background = colors[blockOrder[currentMove-1]];

    document.getElementById("np2").textContent = blockOrder[currentMove];
    document.getElementById("np2").style.background = colors[blockOrder[currentMove]];
}