import React, { Component } from 'react';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs, derivative } from 'mathjs'
import axios from 'axios';

var api;

const columns = [
  {
    title: 'Iteration',
    dataIndex: 'iteration',
    key: 'iteration'
  },
  {
    title: 'X',
    dataIndex: 'x',
    key: 'x'
  },
  {
    title: 'Error',
    dataIndex: 'error',
    key: 'error'
  },
];
var dataTable = [];

class One extends Component {
  constructor() {
    super();
    this.state = {
      size: 'large',
      fx: "",
      x0: 0,
      showTable: false
    };
    this.valueChange = this.valueChange.bind(this);
    this.one = this.one.bind(this);
  }



  f(x) {
    let scope = { x: parseFloat(x) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope)
  }

  error(xnew, xold) {
    return Math.abs((xnew - xold) / xnew);
  }


  createTable(x, error) {
    dataTable = []
    var i = 0;
    for (i = 1; i < error.length; i++) {
      dataTable.push({
        key: i,
        iteration: i,
        x: x[i],
        error: error[i],
      });
    }
   
  }

  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  async dataapi() {
    await axios({ method: "get", url: "http://localhost:5000/database/onepoint", }).then((response) => { console.log("response: ", response.data); api = response.data; });
    await this.setState({
      fx: api.fx,
      x0: api.x0
    })
    this.one()
  }


  one() {
    var fx = this.state.fx;
    var x0 = this.state.x0;
    var xnew = 0;
    var i = 0;
    var error = parseFloat(0.000000);
    var inputdata = []
    inputdata['x'] = []
    inputdata['error'] = []


    do {
      xnew = this.f(x0);
      error = this.error(xnew, x0)
      inputdata['x'][i] = xnew.toFixed(6);
      inputdata['error'][i] = Math.abs(error).toFixed(6);
      i++;
      x0 = xnew;

    } while (Math.abs(error) > 0.000001);


    // console.log(this.state);
    this.createTable(inputdata['x'], inputdata['error']);
    this.setState({ showTable: true })

  }

  render() {

    return (

      <div id="content" style={{ padding: 24, background: '#fff', minHeight: 360, textAlign: 'center' }}>
        <div class="title-newton">
          <h1 style={{ textAlign: 'center', fontSize: "35px" }}>One-Point Methods  </h1>
        </div>
        <form>
          <div class="row" ONE={this.valueChange}>
            <div class="input1">
              <h3 className="text-fx" >F(x) : &nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" name="fx" value={this.state.fx} placeholder="function" onChange={this.valueChange} />
              </h3>
            </div>
            <div class="input2">
              <h3 className="text-xi">X : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" name="x0" value={this.state.x0} placeholder="xl" onChange={this.valueChange} />
              </h3>
            </div>

          </div>
        </form>
        <br /><br />
        <div class="con-btn">
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.one}   >ENTER</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={()=>this.dataapi()} >Ex</button>
        </div>

        <br></br>
        <br></br>

        <div style={{ margin: "30px" }}>

          <h4 style={{ textAlign: 'center', fontSize: '30px' }}>
            <div>
              F(x) = {this.state.fx} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; X = {this.state.x0}
            </div>
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

export default One;