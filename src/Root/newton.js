import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs, derivative } from 'mathjs'
import axios from 'axios';

var api;
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

class Newton extends Component {
  constructor() {
    super();
    this.state = {
      size: 'large',
      fx: "",
      xi: 0,
      showTable: false
    };
    this.valueChange = this.valueChange.bind(this);
    this.newton = this.newton.bind(this);
  }

  function (x)  {
    let scope = { x: parseFloat(x) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope)
  }

  error(xnew, xi) {
    return Math.abs((xnew - xi) / xnew);
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

  Diff (X) {
    var expr = derivative(this.state.fx, 'x');
    let scope = { x: parseFloat(X) };
    return expr.evaluate(scope);

  }

  async dataapi() {
    await axios({ method: "get", url: "http://localhost:5000/database/newtonraphson", }).then((response) => { console.log("response: ", response.data); api = response.data; });
    await this.setState({
      fx: api.fx,
      xi: api.xi
    })
    this.newton(this.state.xi)
  }

  newton(xi) {
    var fx = this.state.fx;
    var xnew = 0;
    var i = 0;
    var error = parseFloat(0.000000);
    var inputdata = []
    inputdata['x'] = []
    inputdata['error'] = []
    inputdata['iteration'] = []

    do {
      xnew = xi - (this.function(this.state.fx,xi) / this.Diff(xi));
      error= this.error(xnew, xi)
      inputdata['x'][i] = xnew.toFixed(6);
      inputdata['error'][i] = Math.abs(error).toFixed(6);
      i++;
      xi = xnew;
  } while (Math.abs(error) > 0.000001);

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
                  <input type="text" name="fx" value={this.state.fx} placeholder="function" onChange={this.valueChange} />
              </h3>
            </div>
            <div class="input2">
              <h3 className="text-xi"> X : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" name="xi" value={this.state.xi} placeholder="start value" onChange={this.valueChange} />
              </h3>
            </div>

          </div>
        </form>
        <br /><br />
        <div class="con-btn">
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.newton}   >ENTER</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.dataapi()}  >Ex</button>
        </div>

        <div style={{ margin: "30px" }}>

          <h4 style={{ textAlign: 'center', fontSize: '30px' }}> fx = {this.state.fx}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x = {this.state.xi}

          </h4>
          <div >
            {this.state.showTable &&
              <Table columns={columns} dataSource={dataTable} ></Table>
            }
          </div>

        </div >

      </div>

    );
  }
}

export default Newton;