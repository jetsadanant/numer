import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';

class App extends Component{
  state = {
    hasError : false,
    users:{}
  }

  componentDidMount(){
    fetch('')
    .then(res => res.json())
    .then(res => this.setState({ users : res}))
    .catch(()=> this.setState({ hasError : true}))
  }

  render(){
    return <div>{JSON.stringify(this.state.users)}</div>
  }

}

export default App;
