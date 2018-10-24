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
    32: '#e2a316',
    64: '#efa706',
    128: '#e8745a',
    256: '#f1512e',
    512: '#f73b12',
    1024: '#acf151',
    2048: '#97ea28',
    4096: '#8bea0c',
    8192: '#28ea64'
} 
let history = { }
let gameStarted = false;
let mobileView = false;
// for mobile browser
function starOnMobileBrowser(){
    if(document.body.clientWidth < 1000 ) {
        mobileView = true;
    }
}
starOnMobileBrowser();

function setCount(count){
    rowCount = count;
    startGame();
}

function startGame(){
    if( !rowCount ) {
        return;
    }
    gameStarted = true;
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
            let borderRadius = 'border-radius:0;';       
            if(grid[col][row]){
                value = grid[col][row];
                emptyCell--;
                borderRadius = 'border-radius:5px;'; 
            }
            if( !win && value == 2048 ) {
                win++;               
            }
            if ( mobileView ) {
                let cellSize = (document.body.clientWidth/rowCount) - 30 + "px";   
                borderRadius = 'border-radius:15px;';            
                innerHTML += '<div class="cell" style="'+borderRadius+' height:'+cellSize+';width:'+cellSize+'; background:'+colorHash[grid[col][row]]+'">' + value + '</div>';
            } else {
                innerHTML += '<div class="cell" style="'+borderRadius+'background:'+colorHash[grid[col][row]]+'">' + value + '</div>';
            }
            
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
    let emptyCell = [];
    let count = 0;
    for (let row = 0 ; row < gridLength; row++ ) {
        for( let col = 0; col < gridLength; col++ ) {
            if( !grid[row][col] ) {
                emptyCell.push(count);
            }
            count++;
        }
    }
    const cellCount = emptyCell.length;
    if( !cellCount ) {
        return;
    }
    const cellIndex = Math.floor((Math.random() * cellCount) );
    const rowNumber = Math.floor(emptyCell[cellIndex] / gridLength);
    const colNumber = emptyCell[cellIndex] <= gridLength-1 ? emptyCell[cellIndex] : emptyCell[cellIndex] % gridLength; 
    if( grid[rowNumber][colNumber] ) {
        insertAtIndex(value);
    }  else {
        grid[rowNumber][colNumber] = value;
    }
    
}

document.onkeydown = function() {    
    if( !gameStarted || rowCount == 0 ) {
        return;
    }
    const input = window.event.charCode || window.event.keyCode;     
   
    if (input == "37") {
        moveLeft();
    } else if (input == "38") {
        moveUp();
    } else if (input == "39") {
        moveRight();
    } else if (input == "40") {
        moveDown();
    } 
}

function moveDown() {
    saveHistory();
    const rowCount = grid.length - 1;
    const colCount = rowCount;
    for(let row = rowCount; row > rowCount-1; row-- ) {
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
    for(let row = 0; row < 1; row++ ) {
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
        for(let col = 0; col < 1; col++) {
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
        for(let col = colCount; col > colCount-1; col--) {
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
            const currentValue = grid[row][col];
            grid[row][col] += grid[rowCount-1][col];
            grid[rowCount-1][col] = 0;
            if ( currentValue ) {
                row--;
            }            
            rowCount--;
           // break;
        } else if ( grid[row][col] !== grid[rowCount-1][col] ) {
            if( (row-1) != (rowCount-1)) {
                grid[row-1][col] = grid[rowCount-1][col];
                grid[rowCount-1][col] = 0;                           
            }    
            row--;     
            rowCount--;      
           // break;
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
            const currentValue = grid[row][col];
            grid[row][col] += grid[rowCount+1][col];
            grid[rowCount+1][col] = 0;
            rowCount++;
            if ( currentValue ) {
                row++; 
            }              
            //break;
        } else if ( grid[row][col] !== grid[rowCount+1][col] ) {
            if( (row+1) != (rowCount+1)) {
                grid[row+1][col] = grid[rowCount+1][col];
                grid[rowCount+1][col] = 0;
                
            }  
            row++;      
            rowCount++;    
           // break;
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
            const currentValue = grid[row][col];
            grid[row][col] += grid[row][colCount-1];
            grid[row][colCount-1] = 0;
            colCount--;
            if ( currentValue ) {
                col--; 
            }            
            //break;
        } else if ( grid[row][col] !== grid[row][colCount-1] ) {
            if( (col-1) != (colCount-1)) {
                grid[row][col-1] = grid[row][colCount-1];
                grid[row][colCount-1] = 0;
               
            }        
            col--;    
            colCount--;
            //break;
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
            const currentValue = grid[row][col];
            grid[row][col] += grid[row][colCount+1];
            grid[row][colCount+1] = 0;
            colCount++;
            if ( currentValue ) {
                col++;
            }
            
           // break;
        } else if ( grid[row][col] !== grid[row][colCount+1] ) {
            if( (col+1) != (colCount+1)) {
                grid[row][col+1] = grid[row][colCount+1];
                grid[row][colCount+1] = 0;               
            }     
            col++
            colCount++;       
           // break;
        }
       
    }
}

// handle swipe on mobile
function swipedetect(el, callback){
    
      var touchsurface = el,
      swipedir,
      startX,
      startY,
      distX,
      distY,
      threshold = 50, //required min distance traveled to be considered swipe
      restraint = 200, // maximum distance allowed at the same time in perpendicular direction
      allowedTime = 300, // maximum time allowed to travel that distance
      elapsedTime,
      startTime,
      handleswipe = callback || function(swipedir){}
    
      touchsurface.addEventListener('touchstart', function(e){
          var touchobj = e.changedTouches[0]
          swipedir = 'none'
          dist = 0
          startX = touchobj.pageX
          startY = touchobj.pageY
          startTime = new Date().getTime() // record time when finger first makes contact with surface
          e.preventDefault()
      }, false)
    
      touchsurface.addEventListener('touchmove', function(e){
          e.preventDefault() // prevent scrolling when inside DIV
      }, false)
    
      touchsurface.addEventListener('touchend', function(e){
          var touchobj = e.changedTouches[0]
          distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
          distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
          elapsedTime = new Date().getTime() - startTime // get time elapsed
          if (elapsedTime <= allowedTime){ // first condition for awipe met
              if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                  swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
              }
              else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                  swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
              }
          }
          handleswipe(swipedir)
          e.preventDefault()
      }, false)
  }
    
  //USAGE:
  
  var el = document.getElementById('appContainer');
  swipedetect(el, function(swipedir){
    if( !gameStarted || rowCount == 0 ) {
        return;
    }
    if (swipedir == "left") {
        moveLeft();
    } else if (swipedir == "up") {
        moveUp();
    } else if (swipedir == "right") {
        moveRight();
    } else if (swipedir == "down") {
        moveDown();
    } 
  });