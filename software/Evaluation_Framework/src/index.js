import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App part={document.getElementById('root').getAttribute("part")} host={document.getElementById('root').getAttribute("host")} assignmentId={document.getElementById('root').getAttribute("assignmentId")} workerId={document.getElementById('root').getAttribute("workerId")} hitId={document.getElementById('root').getAttribute("hitId")}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
