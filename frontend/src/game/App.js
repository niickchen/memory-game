import React, {Component} from 'react';
import {styled} from 'styletron-react';
import {Game} from './game';
import {fetchGet} from '../utils/fetch-get';
import {fetchPost} from '../utils/fetch-post';

const startState = {
  score: 0,
  scoreA: 0,
  scoreB: 0,
  time: 0,
  timeLabel: '0:00',
  num: null,
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...startState,
      maxScore: 0,
      multiple: false,
      interval: null,
    };
    this.updateScore = this.updateScore.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.startGame = this.startGame.bind(this);
    this.pressMultiplayBtn = this.pressMultiplayBtn.bind(this);
  }

  componentDidMount() {
    fetchGet('/api/cards/max').then(res => {
      this.setState({
        maxScore: res.ok ? res.max : 0,
      });
    });
  }

  updateScore({score, scoreA, scoreB}) {
    const maxScore = Math.max(Math.max(this.state.maxScore, score), Math.max(scoreA, scoreB));
    if (maxScore > this.state.maxScore) {
      fetchPost('/api/cards/max', {max: maxScore}); // TODO: error handling, display error message
    }
    this.setState({score, maxScore, scoreA, scoreB});

    if (score === this.state.num || scoreA + scoreB === this.state.num) {
      this.stopTimer();
    }
  }

  updateTime() {
    let time = this.state.time + 1;
    this.setState({time, timeLabel: secondsToMinutesAndSecondsString(time)});
  }

  startTimer() {
    this.setState({
      interval: setInterval(this.updateTime, 1000),
    });
  }

  stopTimer() {
    const {interval} = this.state;
    if (interval) {
      clearInterval(interval);
    }
    this.setState({interval: null});
  }

  startGame(inputValue) {
    // evaluate and set the number of cards
    if (!inputValue || isNaN(inputValue)) {
      return;
    }
    let num = parseInt(inputValue, 10);
    if (num < 36 || num % 2 === 1 || num > 334) {
      return;
    }
    this.stopTimer();
    this.setState({
      ...startState,
    });
    setTimeout(() => this.setState({num}), 100);
  }

  pressMultiplayBtn() {
    const num = this.state.num;
    this.setState({...startState, multiple: !this.state.multiple});
    this.startGame(num);
  }
  
  render() {
    const {num, score, maxScore, timeLabel, multiple, scoreA, scoreB} = this.state;
    const title = score === num ? 'You Win!' : (scoreA + scoreB === num ? (scoreA > scoreB ? 'A wins!' : (scoreA === scoreB ? 'Both wins!' : 'B wins!')) : 'Memory Game');
    const scoreSection = multiple ? (<div><Info>ScoreA: {scoreA}</Info><Info>ScoreB: {scoreB}</Info></div>) : (<Info>Score: {score}</Info>);
    const inputSection = (
      <div>
        <input style={{height: '25px', width: '150px', fontSize: '18pt', textAlign: 'center'}} type='text' ref={ip => this.input = ip}></input>
        <MultiplayerBtn multiple={multiple} onClick={() => this.pressMultiplayBtn()}>Multiplayer?</MultiplayerBtn>
        <Button onClick={() => this.startGame(this.input ? this.input.value : null)}>Start</Button>
        <Desc>Please type in an even number in the range of [36, 334] (inclusive).</Desc>
      </div>
    );
    return (
      <AppPage>
        <Header>
          <Title>{title}</Title>
          <div>
            {scoreSection}
            <Info>Best: {maxScore}</Info>
            <Info>Time: {timeLabel}</Info>
          </div>
          {inputSection}
        </Header>
        {num && <Game num={num} startTimer={this.startTimer} updateScore={this.updateScore} multiple={multiple}></Game>}
      </AppPage>
    );
  }
}

const Header = styled('div', props => ({
  backgroundColor: '#222',
  height: 'fit-content',
  padding: '20px',
  color: 'white',
  marginBottom: '2vh',
}));

const Title = styled('h1', props => ({
  fontSize: '1.5em',
}));

const AppPage = styled('div', props => ({
  textAlign: 'center',
}));

const Desc = styled('div', props => ({
  fontSize: '9pt',
  margin: '10px',
}));

const Button = styled('button', props => ({
  background: 'transparent',
  border: 'none',
  fontSize: '20pt',
  color: 'white',
  cursor: 'pointer',
  ':focus': {
    outline: '0',
  },
}));

const MultiplayerBtn = styled('button', props => ({
  background: props.multiple ? 'lightgreen' : 'white',
  border: 'none',
  fontSize: '18pt',
  borderRadius: '12px',
  color: 'black',
  cursor: 'pointer',
  margin: '0 2vw',
  ':focus': {
    outline: '0',
  },
}));

const Info = styled('h1', props => ({
  fontSize: '1.5em',
  display: 'inline-block',
  width: 'fit-content',
  margin: '4vw 5vw',
}));

function secondsToMinutesAndSecondsString(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  return seconds < 10 ? (minutes + ":0" + seconds) : (minutes + ":" + seconds);
}
