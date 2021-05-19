import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Input, Button, Table, Col } from 'antd';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
import axios from 'axios';

var dataTable = [];
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
        title: 'XM',
        dataIndex: 'xm',
        key: 'xm'
    },
    {
        title: 'Error',
        dataIndex: 'error',
        key: 'error'
    },
];

class bisection extends Component {
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
        this.bisection = this.bisection.bind(this);
    }

    function(x) {
        let scope = { x: parseFloat(x) };
        var expr = compile(this.state.fx);
        return expr.evaluate(scope)
    }

    error(xold, xm) {
        return Math.abs((xm - xold) / xm);
    }


    createTable(xl, xr, xm, error) {
        dataTable = []
        var i = 0;
        for (i = 1; i < error.length; i++) {
            dataTable.push({
                key:i,
                iteration: i,
                xl: xl[i],
                xr: xr[i],
                xm: xm[i],
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
        await axios({method: "get",url: "http://localhost:5000/database/bisection",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
            fx:api.fx,
            xl:api.xl,
            xr:api.xr
        })
        this.bisection()
      }


    bisection() {
        var fx = this.state.fx;
        var xl = this.state.xl;
        var xr = this.state.xr;
        var xold = 0;
        var xm = 0;
        var i = 0;
        var error = 1.0;
        var inputdata = []
        inputdata['xl'] = []
        inputdata['xr'] = []
        inputdata['xm'] = []
        inputdata['error'] = []
        inputdata['iteration'] = []

        while (error >= 0.000001) {
            xm = ((parseFloat(xl) + parseFloat(xr)) / 2);

            if (this.function(xm) == 0) {
                break;
            } else if (this.function(xm) * this.function(xr) < 0) {
                xl = xm;

            } else {
                xr = xm;
            }
            error = this.error(xold, xm);
            xold = xm;
            i++;

            inputdata['iteration'][i] = i;
            inputdata['xl'][i] = parseFloat(xl).toFixed(6);
            inputdata['xr'][i] = parseFloat(xr).toFixed(6);
            inputdata['xm'][i] = parseFloat(xm).toFixed(6);
            inputdata['error'][i] = error.toFixed(6);

        }

        this.createTable(inputdata['xl'], inputdata['xr'], inputdata['xm'], inputdata['error']);
        this.setState({ showTable: true})

    }

    

    render() {

        return (

            <div id="content" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <div class="title-bisec">
                    <h1 style={{ textAlign: 'center', fontSize: "35px" }}> Bisection  </h1>
                </div>

                <div class="container" style={{ textAlign: 'center' }}>
                    <div class="card">
                        <form>
                            <div class="row" bisection={this.valueChange}>
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
                            <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.bisection}   >ENTER</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick= {()=>this.dataapi()}  >Ex</button>
                        </div>
                    </div>
                </div>

                <div style={{ margin: "30px" }}>

                    <h4 style={{ textAlign: 'center',fontSize:'30px' }}> fx = {this.state.fx}
                        <div>
                            xl = {this.state.xl} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; xr = {this.state.xr}
                        </div>
                    </h4>
                    <div >
                    {this.state.showTable &&
                            <Table columns={columns } dataSource={dataTable} ></Table>
                    }
                    </div>
                </div>
            </div >

        );
    }
}



export default bisection;