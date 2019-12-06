import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



  function Square(props) {
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

    /*function RenderBoard(squares) {

      var size = 1;
      while(size*size < squares.length)
        size++; 

      var cols = [];  
      for(let start=0,i=0;i<size;i++) {
  
        cols.push(
          (<div className="board-row">
            {this.createRows(start, size)}
          </div>)
        );
        start += size;  
      }
      
      const board = cols;  
      return board;
    } */
  
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
      /* return (
        <div>{res}</div>
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div> 
      ); */
    }
  }
  
  class Game extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        history : [{squares : Array(9).fill(null), lastFilled : -1}],
        isXnext : true,
        stepNumber : 0,
        toggle : false,
      };
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
      if(calculateWinner(squares) || squares[i])
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

    render() {
      //console.log('render called');
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const row = 3;
      const col = 3;

      let moves = history.map((step, move) => {
        const desc = move ? 
        'jump back to move #' + move + 'pos : ' + Math.floor(step.lastFilled/row) + ' ' +  (step.lastFilled%col):
        'jump back to start';

        return(
          <li key={move}>
          {
            this.state.stepNumber === move && 
            <button onClick={() => this.jumpTo(move)}>
            <b>{desc}</b>
            </button>
          }
          {
            this.state.stepNumber !== move &&  
            <button onClick={() => this.jumpTo(move)}>
            {desc}
            </button>}
          </li>
        );

      });

      if(this.state.toggle)
        moves = moves.reverse();

      let status;
      if(winner)
        status = 'Winner is' + (winner);
      else
        status = 'Next player:' + (this.state.isXnext ? 'X' : 'O');  

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <ol>{moves}</ol>
          </div>
          <div className="btn-toggle">
            <button onClick={() => this.toggleSort()}>
              Toggle Sorting
            </button>
          </div>         
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );


  