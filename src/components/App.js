import React, { Component } from 'react';
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
