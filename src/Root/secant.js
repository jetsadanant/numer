import React, { Component } from 'react';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs, derivative } from 'mathjs'
import axios from 'axios';

var api;
var dataTable = []
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];

class Secant extends Component {
    constructor() {
        super();
        this.state = {
            fx: "",
            x0: 0,
            x1: 0,
            showTable: false

        }
        this.valueChange = this.valueChange.bind(this);
        this.secant = this.secant.bind(this);
    }

    function(x) {
        let scope = { x: parseFloat(x) };
        var expr = compile(this.state.fx);
        return expr.evaluate(scope)
    }

    // error(xnew, xold) {
    //     return Math.abs((xnew - xold) / xnew);
    // }

    createTable(y, error) {
        dataTable = []
        for (var i = 0; i < y.length; i++) {
            dataTable.push({
                key: i,
                iteration: i + 1,
                y: y[i],
                error: error[i]
            });
        }

    }
    valueChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async dataapi() {
        await axios({ method: "get", url: "http://localhost:5000/database/secant", }).then((response) => { console.log("response: ", response.data); api = response.data; });
        await this.setState({
            fx: api.fx,
            xl: api.x0,
            x1: api.x1

        })
        this.secant();
    }

    secant() {
        var x0 = this.state.x0;
        var x1 = this.state.x1;
        var x = [], y = 0;
        var sum;
        var error = parseFloat(0.000000);
        var n = 1, i = 1;
        var inputdata = []
        inputdata['y'] = []
        inputdata['error'] = []
        x.push(x0);
        x.push(x1);
        inputdata['y'][0] = x0;
        inputdata['error'][0] = "0.0000000";

        do {
            y = x[i] - (this.function(x[i]) * ((x[i] - x[i - 1]))) / (this.function(x[i]) - this.function(x[i - 1]));
            x.push(y);
            // sum = x[i];
            error = Math.abs((y - x[i]) / y);
            inputdata['y'][n] = y.toFixed(6);
            inputdata['error'][n] = Math.abs(error).toFixed(6);
            n++;
            i++;

        } while (Math.abs(error) > 0.000001);

        this.createTable(inputdata['y'], inputdata['error']);
        this.setState({
            showTable: true,

        })


    }
    render() {

        return (
            <div id="content" style={{ padding: 24, background: '#fff', minHeight: 360, textAlign: 'center' }}>

                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Secant Method</h1>

                <h2>Equation  : &nbsp;&nbsp;<input size="large" placeholder="function" name="fx" value={this.state.fx} style={{ width: 300 }}onChange={this.valueChange}/></h2>
                <br></br>

                <h2>X0 &nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input size="large" value={this.state.x0} placeholder="" name="x0" style={{ width: 300 }}onChange={this.valueChange}/> </h2>
                <br></br>

                <h2>X1 &nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input size="large" value={this.state.x1} placeholder="" name="x1" style={{ width: 300 }}onChange={this.valueChange}/></h2>
                <br></br>

                <div class="con-btn">
                    <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={this.secant}   >ENTER</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="btn" style={{ background: '#3399CC', color: 'white', width: '80px', height: '50px' }} onClick={() => this.dataapi()} >Ex</button>
                </div>

                <br></br>
                <div style={{ margin: "30px" }}>

                    <h4 style={{ textAlign: 'center', fontSize: '30px' }}>
                        <div>
                            F(x) = {this.state.fx}
                            <div>
                                X0 = {this.state.x0}&nbsp;&nbsp;,&nbsp;&nbsp;&nbsp;  X1 = {this.state.x1}
                            </div>

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
export default Secant;




