import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs, derivative } from 'mathjs'

var dataTable = [];
const columns = [
  {
    title: 'Iteration',
    dataIndex: 'iteration',
    key: 'iteration'
  },
  {
    title: "X",
    dataIndex: "x",
    key: "x"
  },
  {
    title: "Error",
    key: "error",
    dataIndex: "error"
  }
];

class newtonRaph extends Component {
  constructor() {
    super();
    this.state = {
      size: 'large',
      fx: "",
      x0: 0,
      showTable: false
    };
    this.valueChange = this.valueChange.bind(this);
    this.newton = this.newton.bind(this);
  }

  func(x) {
    let scope = { x: parseFloat(x) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope)
  }

  error(xnew, xold) {
    return Math.abs((xnew - xold) / xnew);
  }


  createTable(x, error) {
    dataTable = [];
    for (var i = 0; i < x.length; i++) {
      dataTable.push({
        iteration: i + 1,
        x: x[i],
        error: error[i]
      });
    }
  }

  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(this.state);
  }

  Diff = (X) => {
    var expr = derivative(this.state.fx, 'x');
    let scope = { x: parseFloat(X) };
    return expr.evaluate(scope);

  }

  newton() {
    var fx = this.state.fx;
    var xold = this.state.xold;
    var xnew = 0;
    var i = 0;
    var error = 1;
    var inputdata = []
    inputdata['x'] = []
    inputdata['error'] = []
    inputdata['iteration'] = []

    while (error >= 0.000001) {
      xnew = xold = (this.func(xold) / this.Diff(xold));
      error = this.error(xnew, xold);
      inputdata['iteration'][i] = i;
      inputdata['x'][i] = parseFloat(xnew).toFixed(6);
      inputdata['error'][i] = error.toFixed(6);
      xold = xnew;
      i++;
    }

    console.log(this.state);
    this.createTable(inputdata['x'], inputdata['error']);
    this.setState({ showTable: true })

  }

  render() {

    return (

      <div id="content" style={{ padding: 24, background: '#fff', minHeight: 360, textAlign: 'center' }}>
        <div class="title-newton">
          <h1 style={{ textAlign: 'center', fontSize: "35px" }}>Newton Raphson Method  </h1>
        </div>
        <form>
          <div class="row" newton={this.valueChange}>
            <div class="input1">
              <h3 className="text-fx" >F(x) : &nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" name="fx" placeholder="function" onChange={this.valueChange} />
              </h3>
            </div>
            <div class="input2">
              <h3 className="text-xi"> X : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" name="xold" placeholder="start value" onChange={this.valueChange} />
              </h3>
            </div>

          </div>
        </form>
        <br /><br />
        <div class="con-btn">
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.newton}   >ENTER</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }}   >Graph</button>
        </div>

        <div style={{ margin: "30px" }}>

          <h4 style={{ textAlign: 'center', fontSize: '30px' }}> fx = {this.state.fx}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x = {this.state.xold}

          </h4>
          <div >
            <Table columns={columns} dataSource={dataTable} bordered={true} ></Table>
          </div>

        </div >

      </div>

    );
  }
}

export default newtonRaph;