let rowCount = 0;
let grid = [];
let win = 0;

let filledValueCount = 0;
const allowedNumber = [2,4];
const colorHash = {
    0: '#a9a3a0',
    2: '#bfa491',
    4: '#de925d',
    8: '#dc7229',
    16: '#ef6607',
    32: '#e2e457',
    64: '#e2e42a',
    128: '#e8745a',
    256: '#f1512e',
    512: '#f73b12',
    1024: '#acf151',
    2048: '#97ea28',
    4096: '#8bea0c',
    8192: '#28ea64'
} 
let history = { }

function onRowInput(event) {
    const input = event.charCode || event.keyCode; 
    const value = parseInt(String.fromCharCode(input));
    const validKeyCode = [8,13, 18]    
    if( validKeyCode.indexOf(input) == -1 && ( (event.target.value) || (input < 52 || input > 57) ))  {
        event.preventDefault(); 
        value = null;
    }    
    if(value && !isNaN(value)) {
        rowCount = value;        
        toggleSubmitButtonVisibility(true);
    } else {
        rowCount = 0;
        toggleSubmitButtonVisibility(false);
    }
}

function toggleSubmitButtonVisibility(enable) {
    const submitButton = document.getElementById('submitButton')
    if( submitButton ) {
        if( enable ) {
            submitButton.style.opacity = 1;
            submitButton.style.cursor = 'pointer';
        } else {
            submitButton.style.opacity = 0.6;
            submitButton.style.cursor = 'not-allowed';
        }
    }
    
}

function startGame(){
    if( !rowCount ) {
        return;
    }
    const countContainer = document.getElementById('countContainer');
    const mainContainer = document.getElementById('mainContainer');
    if( countContainer && mainContainer ) {
        countContainer.style.display = 'none';
        mainContainer.style.display = 'block';
        for(let row = 0; row < rowCount; row++) {
            let columns = [];
            for(let col = 0; i=col < rowCount; col++) {
                columns.push(0)
            }
            grid.push(columns)
        }          
        pushNewNumber();  
        renderSquare(grid,document.getElementById('gridContainer'));
    }
    
}

function renderSquare(grid, container) {    
    const colCount = grid.length;    
    let emptyCell = colCount * colCount;
   
    let innerHTML = '';
    for(let col = 0; col < colCount; col++) {
        innerHTML += '<div class="cellWrapper">';
        const rowCount = grid[col].length;
        for(let row = 0 ; row < rowCount ; row++) {
            let value = "";            
            if(grid[col][row]){
                value = grid[col][row];
                emptyCell--;
            }
            if( !win && value == 2048 ) {
                win++;               
            }
            
            innerHTML += '<div class="cell" style="background:'+colorHash[grid[col][row]]+'">' + value + '</div>';
        }
        innerHTML += '</div>';
    }
    container.innerHTML = innerHTML;
    if( !emptyCell ) {
        gameOver();
    }

    if ( win == 1 ) {     
        win ++;  
        gameWin();
    }

}

function undo() {
    if( filledValueCount <= 0 ){
        return;
    }
    filledValueCount--;
    let lastGrid = {grid : history[filledValueCount]}
    grid = JSON.parse(JSON.stringify(lastGrid))['grid'];
    delete history[filledValueCount];    
    if(grid && grid.length) {
        renderSquare(grid,document.getElementById('gridContainer'));
    }
    
}

function reset() {
    history = {};
    filledValueCount = 0;
    grid = [];
    for(let row = 0; row < rowCount; row++) {
        let columns = [];
        for(let col = 0; i=col < rowCount; col++) {
            columns.push(0)
        }
        grid.push(columns)
    }   
    pushNewNumber();  
    renderSquare(grid,document.getElementById('gridContainer'));
}
function gameOver() {
    const gameOver = document.getElementById('over');
    if ( gameOver ) {
        gameOver.style.display = "flex";
    }
}
function gameWin() {
    const gameWin = document.getElementById('win');
    if ( gameWin ) {
        gameWin.style.display = "flex";
    }
}
function continueGame() {
    const gameWin = document.getElementById('win');
    if ( gameWin ) {
        gameWin.style.display = "none";
    }
}
function pushNewNumber() {    
    const valueIndex = Math.floor((Math.random() * allowedNumber.length));
    if( valueIndex < allowedNumber.length ) {
        const value = allowedNumber[valueIndex];
        insertAtIndex(value);
    }
}
function saveHistory() {
    let lastGrid = { grid }
    history[filledValueCount] = JSON.parse(JSON.stringify(lastGrid))['grid'];
    filledValueCount ++;
}
function insertAtIndex( value ) {
    const gridLength = grid.length;
    const cellCount = (gridLength * gridLength) - 1;
    const cellIndex = Math.floor((Math.random() * cellCount) );
    const rowNumber = Math.floor(cellIndex / gridLength);
    const colNumber = cellIndex % gridLength;    
    if (!grid[rowNumber][colNumber]) {
        grid[rowNumber][colNumber] = value;       
        return;

    } else {
        insertAtIndex(value)
    }
}


function moveDown() {
    saveHistory();
    const rowCount = grid.length - 1;
    const colCount = rowCount;
    for(let row = rowCount; row >= 0; row-- ) {
        for(let col = colCount; col >= 0; col--) {
            traverseUp(grid,row,col);                               
        }
    }
    pushNewNumber();
    renderSquare(grid,document.getElementById('gridContainer'));
}

function moveUp() {
    saveHistory();
    const rowCount = grid.length;
    const colCount = rowCount;
    for(let row = 0; row < rowCount; row++ ) {
        for(let col = 0; col < colCount; col++) {
            traverseDown(grid,row,col);                               
        }
    }
    pushNewNumber();
    renderSquare(grid,document.getElementById('gridContainer'));
}

function moveLeft() {
    saveHistory();
    const rowCount = grid.length;
    const colCount = rowCount;
    for(let row = 0; row < rowCount; row++ ) {
        for(let col = 0; col < colCount; col++) {
            traverseRight(grid,row,col);                               
        }
    }
    pushNewNumber();
    renderSquare(grid,document.getElementById('gridContainer'));
}

function moveRight() {
    saveHistory();
    const rowCount = grid.length - 1;
    const colCount = rowCount;
    for(let row = rowCount; row >= 0; row-- ) {
        for(let col = colCount; col >= 0; col--) {
            traverseLeft(grid,row,col);                               
        }
    }
    pushNewNumber();
    renderSquare(grid,document.getElementById('gridContainer'));
}

function traverseUp(grid,row,col) {
    if( row < 1 ) {
        return;
    }

    let rowCount = row;
    while (rowCount > 0 ){        
        if( grid[rowCount-1][col] == 0) {
            rowCount--;
        } else if ( grid[row][col] == 0 || grid[row][col] == grid[rowCount-1][col] ) {
            grid[row][col] += grid[rowCount-1][col];
            grid[rowCount-1][col] = 0;
            break;
        } else if ( grid[row][col] !== grid[rowCount-1][col] ) {
            if( (row-1) != (rowCount-1)) {
                grid[row-1][col] = grid[rowCount-1][col];
                grid[rowCount-1][col] = 0;
            }            
            break;
        }
       
    }
    
}

function traverseDown(grid,row,col) {
    const gridLength = grid.length;
    if( row == gridLength-1 ) {
        return;
    }

    let rowCount = row;
    while (rowCount < gridLength -1 ){        
        if( grid[rowCount+1][col] == 0) {
            rowCount++;
        } else if ( grid[row][col] == 0 || grid[row][col] == grid[rowCount+1][col] ) {
            grid[row][col] += grid[rowCount+1][col];
            grid[rowCount+1][col] = 0;
            break;
        } else if ( grid[row][col] !== grid[rowCount+1][col] ) {
            if( (row+1) != (rowCount+1)) {
                grid[row+1][col] = grid[rowCount+1][col];
                grid[rowCount+1][col] = 0;
            }            
            break;
        }
       
    }    

}

function traverseLeft(grid,row,col) {
    if( col < 1 ) {
        return;
    }

    let colCount = col;
    while (colCount > 0 ){        
        if( grid[row][colCount-1] == 0) {
            colCount--;
        } else if ( grid[row][col] == 0 || grid[row][col] == grid[row][colCount-1] ) {
            grid[row][col] += grid[row][colCount-1];
            grid[row][colCount-1] = 0;
            break;
        } else if ( grid[row][col] !== grid[row][colCount-1] ) {
            if( (col-1) != (colCount-1)) {
                grid[row][col-1] = grid[row][colCount-1];
                grid[row][colCount-1] = 0;
            }            
            break;
        }       
    }
}

function traverseRight(grid,row,col) {
    const gridLength = grid.length;
    if( col == gridLength-1 ) {
        return;
    }

    let colCount = col;    
    while (colCount < gridLength -1 ){        
        if( grid[row][colCount+1] == 0) {
            colCount++;
        } else if ( grid[row][col] == 0 || grid[row][col] == grid[row][colCount+1] ) {
            grid[row][col] += grid[row][colCount+1];
            grid[row][colCount+1] = 0;
            break;
        } else if ( grid[row][col] !== grid[row][colCount+1] ) {
            if( (col+1) != (colCount+1)) {
                grid[row][col+1] = grid[row][colCount+1];
                grid[row][colCount+1] = 0;
            }            
            break;
        }
       
    }
}