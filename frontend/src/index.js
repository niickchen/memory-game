import React from 'react';
import ReactDOM from 'react-dom';
import {Provider as StyletronProvider} from "styletron-react";
import {Client as Styletron} from "styletron-engine-atomic";
import './index.css';
import {App} from './App';
import registerServiceWorker from './registerServiceWorker';

const engine = new Styletron();
ReactDOM.render(
    <StyletronProvider value={engine}>
        <App />
    </StyletronProvider>, 
    document.getElementById('root'));
registerServiceWorker();
