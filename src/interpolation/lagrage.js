import React, { Component } from 'react'
import { Card, Input, Button, Table } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';

var api;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};
var columns = [
    {
        title: "No.",
        dataIndex: "no",
        key: "no"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    }
];
var x, y, tableTag, interpolatePoint, tempTag, fx

class Lagrange extends Component {

    constructor() {
        super();
        x = []
        y = []
        interpolatePoint = []
        tempTag = []
        tableTag = []
        this.state = {
            nPoints: 0,
            X: 0,
            interpolatePoint: 0,
            showinput: true,
            showTableInput: false,
            showoutput: false
        }
        this.valueChange = this.valueChange.bind(this);
        this.lagrange = this.lagrange.bind(this);

    }
    createTableInput(n) {
        for (var i = 1; i <= n; i++) {
            x.push(<Input style={{
                width: "20%",
                height: "10%",
                marginInlineEnd: "1%",
                marginBlockEnd: "1%",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"x" + i} key={"x" + i} placeholder={"x" + i} />);
            y.push(<Input style={{
                width: "20%",
                height: "10%",
                marginInlineEnd: "1%",
                marginBlockEnd: "1%",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"y" + i} key={"y" + i} placeholder={"y" + i} />);
            tableTag.push({
                no: i,
                x: x[i - 1],
                y: y[i - 1]
            });
        }


        this.setState({
            showinput: true,
            showTableInput: true,
        })
    }
    createInterpolatePointInput() {
        for (var i = 1; i <= this.state.interpolatePoint; i++) {
            tempTag.push(<Input style={{
                width: "50%",
                height: "10%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"p" + i} key={"p" + i} placeholder={"p" + i} />)
        }
    }
    initialValue() {
        x = []
        y = []
        for (var i = 1; i <= this.state.nPoints; i++) {
            x[i] = parseFloat(document.getElementById("x" + i).value);
            y[i] = parseFloat(document.getElementById("y" + i).value);
        }
        for (i = 1; i <= this.state.interpolatePoint; i++) {
            interpolatePoint[i] = parseFloat(document.getElementById("p" + i).value);
        }
    }

    L(X, index, n) {
        var numerate = 1/*ตัวเศษ*/, denominate = 1/*ตัวส่วน*/;
        for (var i = 1; i <= n; i++) {
            if (i !== index) {
                numerate *= x[i] - X;
                denominate *= x[i] - x[index];
            }
        }
        console.log(numerate / denominate)
        return parseFloat(numerate / denominate);
    }

    lagrange(n, X) {
        fx = 0
        this.initialValue()
        for (var i = 1; i <= n; i++) {
            fx += this.L(X, i, n) * y[i];
        }
        this.setState({
            showoutput: true
        })

    }

    valueChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async dataapi() {
        await axios({
            method: "get",
            url: "http://localhost:5000/database/lagrange",
        }).then((response) => {
            console.log("response: ", response.data);
            api = response.data;
        });
        await this.setState({
            nPoints: api.nPoints,
            X: api.X,
            interpolatePoint: api.interpolateinput,
        });
        x = []
        y = []
        interpolatePoint = []
        tempTag = []
        tableTag = []
        await this.createInterpolatePointInput();
        await this.createTableInput(api.nPoints);
        for (let i = 1; i <= api.nPoints; i++) {
            document.getElementById("x" + i).value = api.arrayX[i - 1];
            document.getElementById("y" + i).value = api.arrayY[i - 1];
        }
        for (let i = 1; i <= api.interpolateinput; i++) {
            document.getElementById("p" + i).value = api.interpolatePoint[i - 1];
        }
        this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X));
    }
    render() {

        return (
            <div style={{ background: "#F5DEB3", padding: "30px" }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Gauss-Jordan Method</h1>
                <div className="row">
                    <div style={{ textAlign: 'center', fontSize: '21px' }}>
                        {this.state.showinput &&
                            <div>
                                <h4>Number of points : <input type="text" size="large" name="nPoints" value={this.state.row} style={{ width: 150 }} onChange={this.valueChange}></input></h4> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
                                <h4> X  : <input type="text" size="large" name="X" value={this.state.column} style={{ width: 150 }} onChange={this.valueChange}></input></h4><br />
                                <h4>interpolatePoint  : &nbsp;&nbsp;<input size="large" name="interpolatePoint" value={this.state.interpolatePoint} onChange={this.valueChange} style={{ width: 150 }}></input></h4><br />
                                <button id="dimention_button" onClick={() => { this.createTableInput(parseInt(this.state.nPoints)); this.createInterpolatePointInput() }}
                                    style={{ background: "#008080", color: "white" }}>
                                    Enter
                                </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button id="btn_ex" onClick={() => this.dataapi()}
                                    style={{ width: 70, background: "#008080", color: "white" }}>
                                    Ex
                                </button>
                            </div>
                        }
                        {this.state.showTableInput &&
                            <div >
                                <br />

                                <Card style={{ textAlign: "center", fontSize: '30px' }}>
                                    <div style={{ display: "inline-flex", fontSize: '30px' }}>
                                        <div style={{  fontSize: '30px',width:"55%" }}>
                                            <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "white", overflowY: "scroll", minWidth: 120, maxHeight: 300 }}></Table>
                                        </div>
                                        <div style={{  fontSize: '30px',width:"50%" }}>
                                            <h2>interpolatePoint {parseInt(this.state.interpolatePoint) === 2 ? "(Linear)" :
                                                parseInt(this.state.interpolatePoint) === 3 ? "(Quadratic)" :
                                                    "(Polynomial)"}</h2>
                                            <div style={{ display: "inline-block", fontSize: '30px' }}>
                                                {tempTag}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "center", fontSize: '30px' }}>
                                        <button
                                            size="large"
                                            id="btn_matrix"
                                            style={{ color: "white", width: 150, padding: "5px", background: '#CC3300' }}
                                            onClick={() => this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X))}>
                                            Submit
                                </button>
                                    </div>

                                </Card>

                            </div>
                        }


                    </div>

                    <div className="col">
                        {this.state.showoutput &&
                            <Card onChange={this.valueChange}>
                                <p style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "red" }}>Output
                                   <div>{fx}</div> </p>
                            </Card>
                        }
                    </div>
                </div>

            </div>
        );
    }

}
export default Lagrange;