import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props){
      return (
        <button 
            className="square" 
            onClick={props.onClick}>
          {props.value}
        </button>
      );
    }
  
  class Board extends React.Component {
    
    renderSquare(i) {
    return (
        <Square 
            value={this.props.squares[i]}
            onClick = {() => this.props.onClick(i)}
            />);
    }

    render() {
 
      return (
        <div>{

        }
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
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: -1,
                col: -1
            }],
            nextPlayer: 'X',
            stepNumber: 0,
        }
    }

    getRowAndColumn(index){
      const colNum = (index % 3) + 1;
      const rowNum = ((index+1 - colNum)/3) + 1;
      return {row: rowNum, col: colNum};
    }

    handleClick(index){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const currentState = history[history.length - 1];
        const squares = currentState.squares.slice();

        if(this.calculateWinner(squares) || squares[index]){
            return;
        }
        squares[index] = this.state.nextPlayer;

        const itemPos = this.getRowAndColumn(index);

        this.setState((prevState, props) => ({
            history: history.concat({
                squares: squares,
                rowNum: itemPos.row,
                colNum: itemPos.col
            }),
            nextPlayer: prevState.nextPlayer === 'X' ? 'O' : 'X',
            stepNumber: history.length
        }));
    }
  
    calculateWinner(squares) {
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

    goToStep(index){
      this.setState({
          stepNumber: index,
          nextPlayer: index % 2 === 0 ? 'X' : 'O'
      });
    }
    

    render() {

        const history = this.state.history;
        const currentState = history[this.state.stepNumber];
        let winner = this.calculateWinner(currentState.squares);

        const moves = history.map( (item, index) => {
            const desc = index?
            'Go to move  #'  + index  + ` (${history[index].rowNum},${history[index].colNum})`:
            'Go to start of game';

            const fontWeight = index === this.state.stepNumber ? 'bold' : 'normal';

            return (
                <li>
                    <button style={{fontWeight: fontWeight}} onClick={() => this.goToStep(index)}>{desc} </button>
                </li>
            );
        });
        

        let status;
        if(winner){
          status = 'Winner is: ' + winner;
        }else{
          status = 'Next player: ' + this.state.nextPlayer;
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares = {currentState.squares}
                nextPlayer = {this.state.nextPlayer}
                onClick = {(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  