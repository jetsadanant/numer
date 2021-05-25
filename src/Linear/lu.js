import React, { Component } from 'react'
import { Card, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import { lusolve, format } from 'mathjs';
import axios from 'axios';
var api ;
var A = [], B = [], matrixA = [], matrixB = [], output = [], decompose;
class Luu extends Component {

    constructor() {
        super();
        this.state = {
            row: 0,
            column: 0,
            showinput: true,
            showMatrix: false,
            showOutput: false
        }
        this.valueChange = this.valueChange.bind(this);
        this.Lu = this.Lu.bind(this);

    }

    Lu() {
        this.initMatrix();
        decompose = lusolve(A, B)
        for (var i = 0; i < decompose.length; i++) {
            output.push(Math.round(decompose[i]));
            output.push(<br />)
        }
        this.setState({
            showOutput: true
        });


    }

    printFraction(value) {
        return format(value, { fraction: 'ratio' })
    }

    createMatrix(row, column) {
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "18%",
                    height: "50%",
                    backgroundColor: "#06d9a0",
                    marginInlineEnd: "5%",
                    marginBlockEnd: "5%",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold"
                }}
                    id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} />)
            }
            matrixA.push(<br />)
            matrixB.push(<Input style={{
                width: "18%",
                height: "50%",
                backgroundColor: "black",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"b" + i} key={"b" + i} placeholder={"b" + i} />)


        }

        this.setState({
            showinput: true,
            showMatrix: true,
        })


    }
    initMatrix() {
        for (var i = 0; i < this.state.row; i++) {
            A[i] = []
            for (var j = 0; j < this.state.column; j++) {
                A[i][j] = (parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value));
            }
            B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
        }
    }

    valueChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async dataapi() {
        await axios({ method: "get", url: "http://localhost:5000/database/LU", }).then((response) => { console.log("response: ", response.data); api = response.data; });
        await this.setState({
            row: api.row,
            column: api.column,
        });
        matrixA = [];
        matrixB = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.column; j++) {
                document.getElementById("a" + i + "" + j).value =
                    api.arrayA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.arrayB[i - 1];
        }
        this.Lu();
    }
    render() {
        return (
            <div style={{ background: "#F5DEB3", padding: "30px" }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>LU</h1>
                <div className="row">
                    <div style={{ textAlign: 'center', fontSize: '21px' }}>
                        {this.state.showinput &&
                            <div>
                                <h4>Row : <input type="text" size="large" name="row" value={this.state.row} style={{ width: 150 }} onChange={this.valueChange}></input> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                Column : <input type="text" size="large" name="column" value={this.state.column} style={{ width: 150 }} onChange={this.valueChange}></input></h4><br />
                                <button id="dimention_button" onClick={() => this.createMatrix(this.state.row, this.state.column)}
                                    style={{ background: "#008080", color: "white" }}>
                                    Enter
                                </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button id="btn_ex" onClick={() => this.dataapi()}
                                    style={{ width: 70, background: "#008080", color: "white" }}>
                                    Ex
                                </button>
                            </div>
                        }
                        {this.state.showMatrix &&
                            <div >
                                <Card style={{ textAlign: "center", fontSize: '30px' }}>
                                    <div style={{ display: "inline-flex", fontSize: '30px' }}>
                                        <div style={{ display: "block", fontSize: '30px' }}>
                                            <h2 style={{ fontSize: '30px' }}>Matrix [A] <div>{matrixA} </div></h2>
                                        </div>
                                        <div style={{ display: "block", fontSize: '30px' }}>
                                            <h2 style={{ fontSize: '30px' }}>Vector [B]<div >{matrixB} </div> </h2>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "center", fontSize: '30px' }}>
                                        <button
                                            size="large"
                                            id="btn_matrix"
                                            style={{ color: "white", width: 150, padding: "5px", background: '#CC3300' }}
                                            onClick={() => this.Lu()}>
                                            Submit
                                </button>
                                    </div>

                                </Card>

                            </div>
                        }


                    </div>

                    <div className="col">
                        {this.state.showOutput &&
                            <Card onChange={this.valueChange}>
                                <p style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "red" }}>Output
                                   <div>{output}</div> </p>
                            </Card>
                        }
                    </div>
                </div>

            </div>
        );
    }
}
            
export default Luu;