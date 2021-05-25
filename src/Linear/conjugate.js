import React, { Component } from 'react'
import { Card, Input, Button, Table } from 'antd';
import { det, add, subtract, multiply, transpose } from 'mathjs';
import 'antd/dist/antd.css';
import axios from 'axios';
var api;
var A = [], B = [], matrixA = [], matrixB = [], matrixX = [], x, epsilon, dataInTable = [], count = 1, output
var columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "λ",
        dataIndex: "lambda",
        key: "lambda",
    },
    {
        title: "{X}",
        dataIndex: "X",
        key: "X"
    },
    {
        title: "Error",
        dataIndex: "error",
        key: "error"
    }
];
class Gradient extends Component {
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
        this.conjugate = this.conjugate.bind(this);

    }
    positive(size) {
        var tempMatrix = [];
        // var d1 =(parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value));
        // var d2 =(parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value));
        // console.log(d1);
        // console.log(d2);
        for (var i = 0; i < size; i++) {
            tempMatrix[i] = []

            for (var j = 0; j < size; j++) { 
                    tempMatrix[i][j] = A[i][j];
                    if (det(tempMatrix[i][j]) > 0) {
                        size++;
                    }
                    else {                       
                       
                    }
                
            }
        }

        if (size !== this.state.row-1 ) {
            return this.positive(++size);
        }


    }

    conjugate() {

        var R, D, lambda, a
        var error = 0.000001;
        var epsilon;
        this.initMatrix();

        if (!this.positive(1)) {
            this.setState({
                showOutput: true
            });
            return true;
        }
        //array R เข้า
        R = subtract(multiply(A, x), B);
        console.log(R)
        //array D เข้า
        D = multiply(R, -1);
        console.log(D)
        do {

            lambda = (multiply(multiply(transpose(D), R), -1)) / (multiply(multiply(transpose(D), A), D))
            console.log(lambda);

            x = add(x, multiply(lambda, D));
            console.log("x:" + x);

            R = subtract(multiply(A, x), B);
            console.log(R);
            epsilon = Math.sqrt(multiply(transpose(R), R)).toFixed(8);
            // จบ1รอบ

            this.appendTable(lambda, JSON.stringify(x).split(',').join(",\n"), epsilon);
            console.log("error=" + epsilon);

            a = (multiply(multiply(transpose(R), A), D)) / multiply(transpose(D), multiply(A, D)).toFixed(8);
            console.log("a =" + a);
            D = add(multiply(R, -1), multiply(a, D))
            console.log("D =" + D);

        } while (epsilon > error);

        this.setState({
            showOutput: true
        });


    }
    createMatrix(row, column) {
        A = []
        B = []
        matrixA = []
        matrixB = []
        matrixX = []
        x = []
        dataInTable = []
        if (row == column) {
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
                    display: "block",
                    width: "50%",
                    height: "50%",
                    backgroundColor: "black",
                    marginInlineEnd: "5%",
                    marginBlockEnd: "5%",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold"
                }}
                    id={"b" + i} key={"b" + i} placeholder={"b" + i} />)
                matrixX.push(<Input style={{
                    width: "18%",
                    height: "50%",
                    backgroundColor: "black",
                    marginInlineEnd: "5%",
                    marginBlockEnd: "5%",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold"
                }}
                    id={"x" + i} key={"x" + i} placeholder={"x" + i} />)


            }
        }
        else {
            alert("ขนาดเมทริกซ์ไม่เท่ากัน ");
        }

        this.setState({
            showinput: false,
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
            x.push(parseFloat(document.getElementById("x" + (i + 1)).value));
        }
    }

    appendTable(lambda, x, error) {

        dataInTable.push({
            // key: count++,
            iteration: count++,
            lambda: lambda,
            X: x,
            error: error
        });
    }


    valueChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async dataapi() {
        await axios({
            method: "get",
            url: "http://localhost:5000/database/conjugate",
        }).then((response) => {
            console.log("response: ", response.data);
            api = response.data;
        });
        await this.setState({
            row: api.row,
            column: api.column
        });
        matrixA = [];
        matrixB = [];
        matrixX = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.column; j++) {
                document.getElementById("a" + i + "" + j).value = api.arrayA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.arrayB[i - 1];
            document.getElementById("x" + i).value = api.arrayX[i - 1];
        }
        this.conjugate();
    }
    render() {

        return (
            <div style={{ background: "#F5DEB3", padding: "30px" }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Conjugate gradient method</h1>
                <div className="row">
                    <div style={{ textAlign: 'center', fontSize: '21px' }}>
                        {this.state.showinput &&
                            <div>
                                <h4>Row : <input type="text" size="large" name="row" value={this.state.row} style={{ width: 150 }} onChange={this.valueChange}></input> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                Column : <input type="text" size="large" name="column" value={this.state.column} style={{ width: 150 }} onChange={this.valueChange}></input></h4><br />

                                <button id="dimention_button"

                                    onClick={() => { this.createMatrix(this.state.row, this.state.column); }}
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
                                        <div style={{ display: "block", fontSize: '30px' }}>
                                            <h2 style={{ fontSize: '30px' }}>Initial X<div>{matrixX} </div> </h2>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "center", fontSize: '30px' }}>
                                        <button
                                            size="large"
                                            id="btn_matrix"
                                            style={{ color: "white", width: 150, padding: "5px", background: '#CC3300' }}
                                            onClick={() => this.conjugate()}>
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
                                <Table columns={columns} dataSource={dataInTable} ></Table>
                            </Card>
                        }
                    </div>
                </div>

            </div>
        );
    }

}


export default Gradient;