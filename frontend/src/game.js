import React, { Component } from 'react';
import {Card} from './card';
import {fetchPost} from './fetch-post';

export const DEFAULT_BG_COLOR = 'transparent';
const defaultState = {
  colors: null,
  first: null,
  score: 0,
  fetching: false,
  message: '',
  start: false,
  scoreA: 0,
  scoreB: 0,
  round: 0,
};

export class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {...defaultState, colors: init2DArray(this.props.num, DEFAULT_BG_COLOR)};
    this.flip = this.flip.bind(this);
    this.match = this.match.bind(this);
  }

  componentDidMount() {
    fetchPost('/api/cards', {ind: this.props.num}).then(res => {
      if (!res.ok) {
        this.setState({message: res.message});
        return;
      }
      this.setState({
        ...defaultState,
        colors: init2DArray(this.props.num, DEFAULT_BG_COLOR),
      });
    });
  }

  flip(i) {
    if (!this.state.start) {
      this.props.startTimer();
      this.setState({start: true});
    }
    const colors = this.state.colors;
    if (this.state.fetching || colors[i] !== DEFAULT_BG_COLOR) {
      return;
    }
    this.setState({fetching: true, message: ''});

    // fetch the card color from backend
    fetchPost('/api/cards/getColor', {ind: i})
    .then(res => {
      if (!res.ok) {
        this.setState({message: res.message, fetching: false});
        return;
      }
      let colors = this.state.colors;
      colors[i] = res.color;
      if (this.state.first === null) {
        this.setState({first: i, colors, fetching: false});
      } else {
        this.setState({colors});
        // wait 0.7s to check if the two flipped cards match
        setTimeout(() => this.match(this.state.first, i), 700);
      }})
    .catch(error => this.setState({message: error, fetching: false}));
  }

  match(card1, card2) {
    let {colors, scoreA, scoreB, score, round} = this.state;
    // change back to default color if no match
    if (colors[card1] !== colors[card2]) {
      colors[card1] = DEFAULT_BG_COLOR;
      colors[card2] = DEFAULT_BG_COLOR;
      this.setState({colors, first: null, fetching: false, round: round + 1});
    } else {
      // update scores if matched
      let newScore = this.props.multiple ? (round % 2 === 0 ? scoreA : scoreB) : score;
      newScore += 2;
      this.props.multiple ? (round % 2 === 0 ? this.setState({scoreA: newScore, first: null, fetching: false, round: round + 1}) : 
        this.setState({scoreB: newScore, first: null, fetching: false, round: round + 1})) : 
        this.setState({score: newScore, first: null, fetching: false, round: round + 1});
      this.props.updateScore({score: this.state.score, scoreA: this.state.scoreA, scoreB: this.state.scoreB});
    }
  }

  render() {
    return [
      (this.props.multiple ? (this.state.round % 2 ? 
        <div style={{fontSize: '22pt'}} key={0}>B's turn</div> : <div style={{fontSize: '22pt'}} key={0}>A's turn</div>) : null),
      <div key={1}>
        {this.state.colors.map((color, i) => <Card key={i} bgcolor={color} onclick={() => this.flip(i)}></Card>)}
      </div>,
      <div key={2}>{this.state.message}</div>
    ];
  }
}

function init2DArray(num, dv) {
  let arr = new Array(num);
  for (let i = 0; i < num; i++) {
      arr[i] = dv;
  }
  return arr;
}
