import React, { Component } from 'react'
import { Card, Input, Button } from 'antd';
import { det } from 'mathjs';
import 'antd/dist/antd.css';
import axios from 'axios';

var api;
var A = [], B = [], answer = [], matrixA = [], matrixB = []
class Cramer extends Component {

    constructor() {
        super();
        this.state = {
            row: parseInt(0),
            column: parseInt(0),
            showinput: true,
            showMatrix: false,
            showOutput: false
        }
        this.valueChange = this.valueChange.bind(this);
        this.cramer = this.cramer.bind(this);

    }

    cramer() {
        this.initMatrix();
        var counter = 0;

        while (counter != this.state.row) {
            var transformMatrix = JSON.parse(JSON.stringify(A)); //เอา B มาใส่ใน matrixA
        //    console.log(transformMatrix)
            for (var i = 0; i < this.state.row; i++) {
                for (var j = 0; j < this.state.column; j++) {
                    if (j === counter) {
                        transformMatrix[i][j] = B[i]

                        break;
                    }

                }

            }
            counter++;
            answer.push(<h2>X<sub>{counter}</sub>=&nbsp;&nbsp;{Math.round(det(transformMatrix)) / Math.round(det(A))}</h2>)
            answer.push(<br />)

            

        }
        this.setState({
            showOutput: true
        });

    }

    createMatrix(row, column) {
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "10%",
                    height: "10%",
                    marginInlineEnd: "1%",
                    marginBlockEnd: "1%",
                    fontSize: "18px",
                    fontWeight: "bold"
                }}
                    id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} />)
            }
            matrixA.push(<br />)
            matrixB.push(<Input style={{

                width: "10%",
                height: "10%",
                marginInlineEnd: "1%",
                marginBlockEnd: "1%",
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

    //เอาค่าinputมาใส่
    initMatrix() {
        for (var i = 0; i < this.state.row; i++) {
            A[i] = []
            for (var j = 0; j < this.state.column; j++) {
                A[i][j] = (parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value));
            }
            B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
        }
    }

//เปลี่ยนค่า
    valueChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async dataapi() {
        await axios({method: "get",url: "http://localhost:5000/database/cramer",}).then((response) => {console.log("response: ", response.data);api = response.data; });
        await this.setState({
            row: api.row,
            column: api.column,
        });
        matrixA = [];
        matrixB = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.column; j++) {
                document.getElementById("a" + i + "" + j).value =api.matrixA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.matrixB[i - 1];
        }
        this.cramer();
    }

    render() {
        let { row, column } = this.state;
        return (
            <div style={{ background: "#F5DEB3", padding: "30px" }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Cramer's Rule</h1>
                <div className="row">
                    <div style={{ textAlign: 'center', fontSize: '21px' }}>
                        {this.state.showinput &&
                            <div>
                                <h4>Row : <input type="text" size="large" name="row" value={this.state.row} style={{ width: 150 }} onChange={this.valueChange}></input> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                Column : <input type="text" size="large" name="column" value={this.state.column} style={{ width: 150 }} onChange={this.valueChange}></input></h4><br />
                                <button id="dimention_button" onClick={() => this.createMatrix(row, column)}
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
                                            <h2 style={{ fontSize: '30px' }}>Vector [B]<div>{matrixB} </div> </h2>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "center", fontSize: '30px' }}>
                                        <button
                                            size="large"
                                            id="btn_matrix"
                                            style={{ color: "white", width: 150, padding: "5px", background: '#CC3300' }}
                                            onClick={() => this.cramer()}>
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
                                   <div>{answer}</div> </p>
                            </Card>
                        }
                    </div>
                </div>

            </div>
        );
    }
}
export default Cramer;




