import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.props.routes}
      </div>
    );
  }
}

export default App;
