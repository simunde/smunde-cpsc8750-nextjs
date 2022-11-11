import * as Chess from 'js-chess-engine';
import styles from '../styles/Chess.module.css';

export default function ChessPage() {
  // Tell React to put a div down that is
  // controlled by the makeGame function
  return <div ref={makeGame} />;
}


// maps js-chess-engine's codes to text chess pieces
const GLYPHS = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟︎",
};


function makeGame(div) {
  //div.innerText = 'content now controlled by makeGame';
// make a new html <table> to render chess
  //const board = document.createElement('table');
  //board.className = styles.board;
  //fillInBoard(board);

  // put that table into the div we control
  //div.appendChild(board);


// make a new html <table> to render chess
  const board = document.createElement('table');
  board.className = styles.board;
  fillInBoard(board);

  // put that table into the div we control
  div.appendChild(board);

  // make a new chess game
  const game = new Chess.Game();
  let gameState = game.exportJson();

  // loop through and update all the squares with a piece on them
  Object.keys(gameState.pieces).forEach(square => {
    // square will be "A1" through "H8"

    // get the html element representing that square
    const el = document.getElementById(square);

    // take that piece and put its corresponding glyph into the square
    const piece = gameState.pieces[square];
    el.innerText = GLYPHS[piece];
  });

// either null or the actively selected square
let selected = null;
let ai_turn=false;
let moves=null;
// make an onClick function
  const onClick = event => {
    const square = event.target.id;
    console.log('clicked ' + square);
  

// check to see if we are moving a piece
  if (selected && gameState.moves[selected].includes(square)) {
      gameState.moves[selected].forEach(ml=>{    
      console.log(ml);
      const el = document.getElementById(ml);
      el.classList.remove(styles.isMoveOption);
    }
    )
    // move the piece
    game.move(selected, square);
    gameState = game.exportJson();

    // update the text by clearing out the old square
    document.getElementById(selected).innerText = "";
    // and putting the piece on the new square
    document.getElementById(square).innerText = GLYPHS[gameState.pieces[square]];

    // reset the selection state to unselected
    selected = null;
    ai_turn=true;
  } else if (selected) {
    // they tried to move a piece to a random spot on the board
      gameState.moves[selected].forEach(ml=>{    
      console.log(ml);
      const el = document.getElementById(ml);
      el.classList.remove(styles.isMoveOption);
    })
    return;
  } else if (gameState.moves[square]) {
    // clicked on a piece that can move,
    // set the selection to that piece
    selected = square;
moves=gameState.moves[square];
    gameState.moves[square].forEach(ml=>{    
      console.log(ml);
      const el = document.getElementById(ml);
      el.classList.add(styles.isMoveOption);
    }
    )
}
    if(ai_turn) {
     const [movedFrom, movedTo] = Object.entries(game.aiMove())[0];
     console.log('AI from  ' + movedFrom);
     console.log('AI to clicked ' + movedTo);
    
     console.log('beyekteb ');
    
    // update the text by clearing out the old square
     document.getElementById(movedFrom).innerText = "";
    // and putting the piece on the new square
     document.getElementById(movedTo).innerText = GLYPHS[gameState.pieces[movedTo]];
     console.log('bey7arak ');
   // move the piece
     gameState = game.exportJson();
     console.log('bey7arak ');
     ai_turn=false;
  }

}

  // put that onClick function on every square
  Array.from(
    board.getElementsByClassName(styles.square)
  ).forEach(el => {
    el.onclick = onClick;
  });

}

// makes a chess board out of an html table
function fillInBoard(board) {
  const COLNAMES = " ABCDEFGH";

  const body = document.createElement('tbody');

  // make each row in the table
  for (let r = 8; r >= 1; r--) {
    const row = document.createElement('tr');

    // number each row
    const rowLabel = document.createElement('td');
    rowLabel.innerText = r.toString();
    row.appendChild(rowLabel);

    // add the board squares
    for (let c = 1; c <= 8; c++) {
      const colName = COLNAMES[c];

      const square = document.createElement('td');
      square.id = colName + r;

      // color alternating squares
      const color = (r + c) % 2 ? styles.white : styles.black;
      square.className = styles.square + ' ' + color;

      row.appendChild(square);
    }

    body.appendChild(row);
  }

  // put column numbers on the bottom
  const footer = document.createElement('tr');
  for (let c = 0; c <= 8; c++) {
    const label = document.createElement('td');
    label.innerText = COLNAMES[c];

    footer.appendChild(label);
  }

  body.appendChild(footer);

  board.appendChild(body);
}

