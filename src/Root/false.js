
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'

// import api from '../api'
//import Title from 'antd/lib/skeleton/Title';

var dataGraph = []
const PlotlyComponent = createPlotlyComponent(Plotly)
const { Title } = Typography;

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
      showTable: false
      
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
  
  false = (xl, xr) => {
    var fx = this.state.fx;
    var xl = this.state.xl;
    var xr = this.state.xr;
    var xold = 0;
    var x1 = 0;
    var i = 0;
    var error = 1;
    var inputdata = []
    inputdata['xl'] = []
    inputdata['xr'] = []
    inputdata['x1'] = []
    inputdata['error'] = []
    inputdata['iteration'] = []
    while (error >= 0.000001) {
      x1 = ((parseFloat(xl) * this.function(xr)) - (parseFloat(xr) * this.function(xl))) / (this.function(xr) - this.function(xl));
      if (this.function(x1) == 0) {
        break;
      } else if (this.function(x1) * this.function(xr) > 0) {
        xr = x1;
      } else {
        xl = x1;
      }

      error = this.error(xold, x1);
      i++;
      xold = x1;

      inputdata['iteration'][i] = i;
      inputdata['xl'][i] = parseFloat(xl).toFixed(6);
      inputdata['xr'][i] = parseFloat(xr).toFixed(6);
      inputdata['x1'][i] = parseFloat(x1).toFixed(6);
      inputdata['error'][i] = error.toFixed(6);


    }
    // console.log(this.state);
    this.createTable(inputdata['xl'], inputdata['xr'], inputdata['x1'], inputdata['error']);
    this.setState({ showTable: true});
   
  }



  render() {

    let layout = {
      title: 'false',
      xaxis: {
        title: 'X'
      }
    };
    let config = {
      showLink: false,
      displayModeBar: true
    };

    const { size } = this.state;
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
                      <input type="text" name="fx" placeholder="function" onChange={this.valueChange} />
                  </h3>
                </div>
                <div class="input2">
                  <h3 className="text-xl">XL : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" name="xl" placeholder="xl" onChange={this.valueChange} />
                  </h3>
                </div>
                <div class="input3">
                  <h3 className="text-xr">XR : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input type="text" name="xr" placeholder="xr" onChange={this.valueChange} />
                  </h3>
                </div>
              </div>
            </form>
            <br /><br />
            <div class="con-btn">
              <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.false}   >ENTER</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }}   >Graph</button>

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
            <Table columns={columns} dataSource={dataTable} ></Table>
          </div>

        </div >




      </div >

    );
  }
}



export default falseposition;