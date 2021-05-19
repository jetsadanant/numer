
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
import axios from 'axios';


var api;

const columns = [
  {
    title: 'Iteration',
    dataIndex: 'iteration',
    key: 'iteration'
  },
  {
    title: 'XL',
    dataIndex: 'xl',
    key: 'xl'
  },
  {
    title: 'XR',
    dataIndex: 'xr',
    key: 'xr'
  },
  {
    title: 'X1',
    dataIndex: 'x1',
    key: 'x1'
  },
  {
    title: 'Error',
    dataIndex: 'error',
    key: 'error'
  },
];
var dataTable = [];
class falseposition extends Component {
  constructor() {
    super();
    this.state = {
      size: 'large',
      fx: "",
      xl: 0,
      xr: 0,
      showTable: false,


    };
    this.valueChange = this.valueChange.bind(this);
    this.false = this.false.bind(this);
  }

  function(x) {
    let scope = { x: parseFloat(x) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope)
  }

  error(xold, x1) {
    return Math.abs((x1 - xold) / x1);
  }

  createTable(xl, xr, x1, error) {
    dataTable = []
    var i = 0;
    for (i = 1; i < error.length; i++) {
      dataTable.push({
        key: i,
        iteration: i,
        xl: xl[i],
        xr: xr[i],
        x1: x1[i],
        error: error[i],
      });
    }
  }

  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(this.state);
  }

  async dataapi() {
    await axios({ method: "get", url: "http://localhost:5000/database/falseposition", }).then((response) => { console.log("response: ", response.data); api = response.data; });
    await this.setState({
      fx: api.fx,
      xl: api.xl,
      xr: api.xr
    })
    this.false()
  }


  false = () => {
    var fx = this.state.fx;
    var xl = this.state.xl;
    var xr = this.state.xr;
    var xold = 0;
    var x1 = 0;
    var i = 0;
    var inF = false;
    var error = parseFloat(0.000000);
    var inputdata = []
    inputdata['xl'] = []
    inputdata['xr'] = []
    inputdata['x1'] = []
    inputdata['error'] = []
    inputdata['iteration'] = []
    if (this.function(xl) < this.function(xr)) {
      inF = true;
    }
    do {
      x1 = (xl * this.function(xr) - xr * this.function(xl)) / (this.function(xr) - this.function(xl));
      if (this.function(x1) * this.function(xr) < 0) {
        error = this.error(x1, xr);
        if (inF) {
          xl = x1;
        }
        else {
          xr = x1;
        }

      }
      else {
        error = this.error(x1, xl);
        if (inF) {
          xr = x1;
        }
        else {
          xl = x1;
        }

      }
      inputdata['iteration'][i] = i;
      inputdata['xl'][i] = parseFloat(xl).toFixed(6);
      inputdata['xr'][i] = parseFloat(xr).toFixed(6);
      inputdata['x1'][i] = parseFloat(x1).toFixed(6);
      inputdata['error'][i] = error.toFixed(6);
      i++;

    } while (Math.abs(error) > 0.000001);

    // console.log(this.state);
    this.createTable(inputdata['xl'], inputdata['xr'], inputdata['x1'], inputdata['error']);
    this.setState({ showTable: true });

  }



  render() {

    return (

      <div id="content" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
        <div class="title-bisec">
          <h1 style={{ textAlign: 'center', fontSize: "35px" }}> False-Position  </h1>
        </div>

        <div class="container" style={{ textAlign: 'center' }}>
          <div class="card">
            <form>
              <div class="row" false={this.valueChange}>
                <div class="input1">
                  <h3 className="text-fx" >F(x) : &nbsp;&nbsp;&nbsp;&nbsp;
                      <input type="text" name="fx" value={this.state.fx} placeholder="function" onChange={this.valueChange} />
                  </h3>
                </div>
                <div class="input2">
                  <h3 className="text-xl">XL : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" name="xl" value={this.state.xl} placeholder="xl" onChange={this.valueChange} />
                  </h3>
                </div>
                <div class="input3">
                  <h3 className="text-xr">XR : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input type="text" name="xr" value={this.state.xr} placeholder="xr" onChange={this.valueChange} />
                  </h3>
                </div>
              </div>
            </form>
            <br /><br />
            <div class="con-btn">
              <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.false}  >ENTER</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={() => this.dataapi()}  >Ex</button>

            </div>
          </div>
        </div>


        <div style={{ margin: "30px" }}>

          <h4 style={{ textAlign: 'center', fontSize: '30px' }}> fx = {this.state.fx}
            <div>
              xl = {this.state.xl} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; xr = {this.state.xr}
            </div>
          </h4>
          <div >
            {this.state.showTable &&
              <Table columns={columns} dataSource={dataTable} ></Table>
            }
          </div>

        </div >




      </div >

    );
  }
}



export default falseposition;