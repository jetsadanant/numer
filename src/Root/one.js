import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs, derivative } from 'mathjs'
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
    title: 'X0',
    dataIndex: 'x1',
    key: 'x1'
  },
  {
    title: 'X',
    dataIndex: 'x2',
    key: 'x2'
  },
  {
    title: 'Error',
    dataIndex: 'error',
    key: 'error'
  },
];
var dataTable = [];

class newtonRaph extends Component {
  constructor() {
    super();
    this.state = {
      size: 'large',
      fx: "",
      x1: 0,
      x2: 0,
      x0: 0,
      showTable: false
    };
    this.valueChange = this.valueChange.bind(this);
    this.one = this.one.bind(this);
  }


  //   componentDidMount = async () => {
  //     await api.getFunctionByName("Newton").then(db => {
  //       this.setState({
  //         fx: db.data.data.fx,
  //         x1: db.data.data.x,
  //       })
  //       console.log(this.state.fx);
  //       console.log(this.state.x0);
  //       console.log(this.state.x1);
  //     })
  //   }

  Graph(x2) {
    dataGraph = [
      {
        type: 'scatter',
        x: x2,
        marker: {
          color: '#3c753c'
        },
        name: 'X1'
      },
    ];

  }


  f(x) {
    let scope = { x: parseFloat(x) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope)
  }

  error(xm, x0) {
    return Math.abs(xm - x0);
  }


  createTable(x2, x1, error) {
    dataTable = []
    var i = 0;
    for (i = 1; i < error.length; i++) {
      dataTable.push({
        iteration: i,
        x2: x2[i],
        x1: x1[i],
        error: error[i],
      });
    }
    console.log(x1)
  }

  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(this.state);
  }

  one() {
    var fx = this.state.fx;
    var x1 = this.state.x1;
    var x2 = 0;
    var xm = 0;
    var check = 0;
    var x0 = 0;
    var i = 0;
    var error = 1;
    var inputdata = []
    inputdata['x1'] = []
    inputdata['x2'] = []
    inputdata['error'] = []
    inputdata['iteration'] = []

    check = this.f(x1)
    while (abs(check) >= 0.000001) {
      check = (this.f(x1) - parseFloat(x1)) / this.f(x1);
      x2 = x1
      x1 = this.f(x1)
      error = this.error(x1, x2);
      inputdata['iteration'][i] = i;
      inputdata['x1'][i] = parseFloat(x1).toFixed(6);
      inputdata['x2'][i] = parseFloat(x2).toFixed(6);
      inputdata['error'][i] = error.toFixed(6);

      i++;
    }
    console.log(this.state);
    this.createTable(inputdata['x2'], inputdata['x1'], inputdata['error']);
    this.setState({ showTable: true, showGrap: true })
    this.Graph(inputdata['x2'])
  }

  render() {

    let layout = {
      title: 'one',
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

      <div id="content" style={{ padding: 24, background: '#fff', minHeight: 360, textAlign: 'center' }}>
        <div class="title-newton">
          <h1 style={{ textAlign: 'center', fontSize: "35px" }}>One-Point Methods  </h1>
        </div>
        <form>
          <div class="row" ONE={this.valueChange}>
            <div class="input1">
              <h3 className="text-fx" >F(x) : &nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" name="fx" placeholder="function" onChange={this.valueChange} />
              </h3>
            </div>
            <div class="input2">
              <h3 className="text-xi">Xi-1 : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" name="xi" placeholder="xl" onChange={this.valueChange} />
              </h3>
            </div>

          </div>
        </form>
        <br /><br />
        <div class="con-btn">
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.one}   >ENTER</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.Garph}   >Graph</button>
        </div>
        <div>
          <br></br>
          <br></br>
          {this.state.showTable === true ?
            <div>
              {/* <h2 style={{ textAlign: 'center' }}>Table of Newton Raphson</h2> */}
              <h4 style={{ textAlign: 'center' }}> fx = {this.state.fx}
                <br></br> x = {this.state.x1}
                <Table columns={columns} dataSource={dataTable} size="middle" /></h4></div> : ''}
          {this.state.showGrap === true ?
            <PlotlyComponent data={dataGraph} Layout={layout} config={config} /> : ''
          }

        </div>

      </div>

    );
  }
}

export default newtonRaph;