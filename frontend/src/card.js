import React, {Component} from 'react';
import {styled} from 'styletron-react';
import {DEFAULT_BG_COLOR} from './game';

export class Card extends Component {
  render() {
    const {bgcolor, onclick} = this.props;
    return (
      <ACard bgcolor={bgcolor} onClick={onclick}></ACard>
    );
  }
}

const ACard = styled('div', props => ({
  display: 'inline-block',
  width: '70px',
  height: '100px',
  margin: '2vw',
  borderRadius: '6px',
  'transition-duration': '0.8s',
  'transition-property': 'transform, background-color, background-image',
  transform: props.bgcolor !== DEFAULT_BG_COLOR ? 'rotateY(180deg)' : '',
  backgroundImage: props.bgcolor !== DEFAULT_BG_COLOR ? null : "url('https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-tally-ho-circle-back-1_1024x1024.png')",
  backgroundRepeat: 'no-repeat',
  backgroundColor: props.bgcolor,
  backgroundSize: 'cover',
  cursor: 'pointer',
}));
