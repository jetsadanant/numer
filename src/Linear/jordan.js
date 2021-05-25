import React, { Component } from 'react'
import { Card, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
var api;
var A = [], B = [], matrixA = [], matrixB = [], output = []
class Jordan extends Component {

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
        this.jordan = this.jordan.bind(this);

    }

    jordan(row) {
        this.CollectionMatrix();
        if (A[0][0] === 0) { //สลับ
            var tempRow = JSON.parse(JSON.stringify(A[0]));
            var tempColumn = B[0];
            A[0] = A[1];
            A[1] = tempRow;
            B[0] = B[1];
            B[1] = tempColumn;
        }
        //0สามเหลี่ยมล่าง
        for (var k = 0; k < row; k++) {
            for (var i = k + 1; i < row; i++) {
                var factor = A[i][k] / A[k][k];
               
                for (var j = k; j < row; j++) {
                    A[i][j] = A[i][j] - factor * A[k][j];
                }
                B[i] = B[i] - factor * B[k];
               
            }
        }
        for (k = row - 1; k >= 0; k--) {
            for (i = k; i >= 0; i--) {

                if (i === k) {
                    factor = 1 / A[i][k]; //1ทะเเยง

                    for (j = 0; j < row; j++) {
                        A[i][j] = A[i][j] * factor;
                        
                    }
                    B[i] = B[i] * factor;

                }
                else { //ทำสามเหลี่ยมบน
                    factor = A[i][k] / A[k][k];
                    for (j = 0; j <row; j++) {
                        A[i][j] = A[i][j] - factor * A[k][j];
                    }
                    B[i] = B[i] - factor * B[k];
                }
            }
        }
        for (i = 0; i < row; i++) {
            output.push("x" + (i + 1) + " = " + B[i] );
            output.push(<br />)
            //ได้ x1,x2,x3
            // console.log(output);
        }
      
        // console.log(factor);
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
                display:"block",
                width: "50%",
                height: "15%",
                marginInlineEnd: "15%",
                marginBlockEnd: "15%",
                fontSize: "18px",
                fontWeight: "bold",
                textAlign:"center"
            }}
                id={"b" + i} key={"b" + i} placeholder={"b" + i} />)
                
        }

        
        this.setState({
            showinput: true,
            showMatrix: true,
        })


    }
    //ดึงค่ามา เเละเอามาใส่b
    CollectionMatrix() {
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
        await axios({ method: "get", url: "http://localhost:5000/database/gaussjordan", }).then((response) => { console.log("response: ", response.data); api = response.data; });
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
                    api.matrixA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.matrixB[i - 1];
        }
        this.jordan(this.state.row);
    }

    render() {
       
        return (
            <div style={{ background: "#F5DEB3", padding: "30px" }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Gauss-Jordan Method</h1>
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
                                            <h2 style={{ fontSize: '30px' }}>Vector [B]<div>{matrixB} </div> </h2>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "center", fontSize: '30px' }}>
                                        <button
                                            size="large"
                                            id="btn_matrix"
                                            style={{ color: "white", width: 150, padding: "5px", background: '#CC3300' }}
                                            onClick={() => this.jordan(this.state.row)}>
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
export default Jordan;



