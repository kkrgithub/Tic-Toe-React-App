import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';




  function Square(props) {

    if(props.won)
      return (
        <button className="square win" onClick={props.onClick}>
            {props.value}
        </button>
      );
    else
      return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
      );  
        
    } 
  
  class Board extends React.Component {

    renderSquare(i) {
      return (<Square 
      key={i}  
      won={this.props.winner && this.props.winner.includes(i)}
      value={this.props.squares[i]} 
      onClick = {() => this.props.onClick(i)}
      /> );
    }

    createRows(start, size) {
      let tmp = []; 

      for(let i=0;i<size;i++)
        tmp.push(this.renderSquare(start++));   

      const rows = tmp  
      return rows;
    }
  
    render() {  
      //const res = this.renderBoard(this.props.squares);

      var size = 1;
      while(size*size < this.props.squares.length)
        size++; 

      var cols = [];  
      for(let start=0,i=0;i<size;i++) {
        cols.push(
          (<div className="board-row" key={i}>
            {this.createRows(start, size)}
          </div>)
        );
        start += size;  
      }
      
      const board = cols;  
      return board;      

    }
  }
  
  class Game extends React.Component {

    render() {
      //console.log('render called');
      const history = this.props.history;
      const current = history[this.props.stepNumber];
      const winner = calculateWinner(current.squares, this.props.boardSize);
      const row = this.props.boardSize;
      const col = row;

      let moves = history.map((step, move) => {
        const desc = move ? 
        'jump back to move #' + move + 'pos : ' + Math.floor(step.lastFilled/row) + ' ' +  (step.lastFilled%col):
        'jump back to start';

        return(
          <li key={move}>
          {
            this.props.stepNumber === move && 
            <button onClick={() => this.props.jumpTo(move)}>
            <b>{desc}</b>
            </button>
          }
          {
            this.props.stepNumber !== move &&  
            <button onClick={() => this.props.jumpTo(move)}>
            {desc}
            </button>}
          </li>
        );

      });

      if(this.props.toggle)
        moves = moves.reverse();

      let status;
      if(winner)
        status = 'Winner is ' + (current.squares[winner[0]]);
      else if(this.props.stepNumber === current.squares.length)
        status = 'Game is a draw!'; 
      else
        status = 'Next player:' + (this.props.isXnext ? 'X' : 'O');   

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} winner={winner} onClick={(i) => this.props.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <ol>{moves}</ol>
          </div>
          <div className="btn-toggle">
            <button onClick={() => this.props.toggleSort()}>
              Toggle Sorting
            </button>
          </div>         
        </div>
      ); 
      
      //console.log(this.props);
      //return (<h1>hi</h1>);

    } 
  }

  function calculateWinner(squares, boardSize) {

    boardSize = parseInt(boardSize);

    // check rows
    let winRow = -1; let curRow = 0;
    for(let i=0;i<boardSize;i++) {
      winRow = curRow;
      for(let j=0;j<boardSize;j++) {

        if(!squares[curRow] || (squares[curRow] !== squares[curRow+j]))
          winRow = -1;
      }

      if(winRow >= 0) {

        let winner = [];
        winner.push(winRow);
        for(let i =1;i<boardSize;i++) 
          winner.push(winRow+i);
  
        return winner;  
      }      

      curRow += boardSize;
    }
  
    //check columns

    let winCol = -1;
    let curCol = 0;

    for(let c=0;c<boardSize;c++) {

      winCol = curCol;
      for(let j=0;j<boardSize;j++) {
        if(!squares[curCol] || (squares[curCol] !== squares[curCol+(j*boardSize)]))
          winCol = -1;
      }    
 
      if(winCol >= 0) {

        let winner = [];
        winner.push(winCol);

        for(let i =1;i<boardSize;i++) 
          winner.push(winCol+(i*boardSize));

        return winner;  
      }      
      curCol = c+1;      

    }

    // check diagonals

    //check right to left diagonal
    let curDlSq = 0; let prevDlSq = 0 ; let winDl = 0;

    for(let i=0;i<boardSize;i++) {
      if(!squares[curDlSq] || (squares[curDlSq] !== squares[prevDlSq])) {
        winDl = -1;
        break;
      }
      prevDlSq = curDlSq;
      curDlSq += boardSize+1;
    }

    if(winDl >= 0) {
      let winner = [];
      for(let i=0;i<boardSize;i++) {
        winner.push(winDl);
        winDl += boardSize+1;
      }
      return winner;
    }


    // check right to left diagonal
    curDlSq = boardSize-1; prevDlSq = boardSize-1 ; winDl = boardSize-1;

    for(let i=0;i<boardSize;i++) {
      if(!squares[curDlSq] || (squares[curDlSq] !== squares[prevDlSq])) {
        winDl = -1;
        break;
      }
      prevDlSq = curDlSq;
      curDlSq += boardSize-1;
    }

    if(winDl >= 0) {
      let winner = [];
      for(let i=0;i<boardSize;i++) {
        winner.push(winDl);
        winDl += boardSize-1;
      }
      return winner;
    }    

    return null;
  }

  class PlayGround extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        history : [{squares : Array(9).fill(null), lastFilled : -1}],
        isXnext : true,
        stepNumber : 0,
        toggle : false,
        boardSize : 3,
        renderBoard : false,
      };  
      this.setChoice = this.setChoice.bind(this);  
      this.setSelected = this.setSelected.bind(this);  
      this.handleClick = this.handleClick.bind(this);
      this.jumpTo = this.jumpTo.bind(this);
      this.toggleSort = this.toggleSort.bind(this);
    }

    jumpTo(step) {
      this.setState({
        stepNumber : step,
        isXnext : (step % 2 === 0)
      });
    }
   
    toggleSort() {
      this.setState({
        toggle : !this.state.toggle,
      });
    }    

    handleClick(i) {

      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      if(calculateWinner(squares, this.state.boardSize) || squares[i])
        return;
      squares[i] = this.state.isXnext ? 'X' : 'O';
      this.setState({
        history: history.concat(
          [{squares : squares, lastFilled : i}]
          ), 
        stepNumber : history.length,  
        isXnext : !this.state.isXnext
      }); 
    }    

    gameChoice(options) {

      const selectionList = options.map((val, ind) => {
          return (<option key={val}>{val}</option>);
      });

      return (<div>
        <h1>Hello Players ! Choose your board Size</h1>
        <select value={this.state.boardSize} onChange={this.setSelected}>
        {selectionList}
        </select>
        <button onClick={this.setChoice}>submit</button>
      </div>);
    }

    setSelected(event) {
      this.setState({
        boardSize : event.target.value,
      });
    }

    setChoice() {
      let size = this.state.boardSize;
      size *= size;
      this.setState({
        history : [{squares : Array(size).fill(null), lastFilled : -1}],
        isXnext : true,
        stepNumber : 0,
        toggle : false,
        renderBoard : true,
      });
    }




    render() {
      if(this.state.renderBoard)
        return (<Game 
          jumpTo = {this.jumpTo}
          toggleSort = {this.toggleSort}
          handleClick = {this.handleClick}
          history = {this.state.history}
          isXnext = {this.state.isXnext}
          stepNumber = {this.state.stepNumber}
          toggle = {this.state.toggle}
          boardSize = {this.state.boardSize}
        />);

      const options = [3, 4, 5, 6, 7, 8, 9, 10];
      const Ground = this.gameChoice(options);
      return Ground;  
    }

  }

  
  // ========================================
  
  ReactDOM.render(
    <PlayGround />,
    document.getElementById('root')
  );


  