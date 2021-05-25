import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';

var api;
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
var x, y, tableTag,  interpolatePoint, tempTag, fx

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
            showInput : true,
            showTable: false,
            showOutput: false
        }
        this.valueChange = this.valueChange.bind(this);
        this.lagrange = this.lagrange.bind(this);
    
    }  
    // 1 สร้าง input เก็บ input ใน x[],y[]
    createTableInput(nPoints) {
        for (var i=1 ; i<=nPoints ; i++) {
            x.push(<Input style={{
                width: "50%",
                height: "40%", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
            id={"x"+i} key={"x"+i} placeholder={"x"+i}/>);
            y.push(<Input style={{
                width: "50%",
                height: "500%", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"y"+i} key={"y"+i} placeholder={"y"+i}/>);   
            tableTag.push({
                no: i,
                x: x[i-1],
                y: y[i-1]
            });
        }


        this.setState({
            showInput: true,
            showTable: true,
        })
    }
    // 1 เก็บ input ใน tempTag[]
    createInterpolatePointInput(){
        for (var i=1 ; i<=this.state.interpolatePoint ; i++) {
            tempTag.push(<Input style={{
                width: "10%",
                height: "40%", 
                // backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"p"+i} key={"p"+i} placeholder={"p"+i} />)
        }
    }
    initialValue() {
        x = []
        y = []
        for (var i=1 ; i<=this.state.nPoints ; i++) {
            x[i] = parseFloat(document.getElementById("x"+i).value);
            y[i] = parseFloat(document.getElementById("y"+i).value);
        }
        for (i=1 ; i<=this.state.interpolatePoint ; i++) {
            interpolatePoint[i] = parseFloat(document.getElementById("p"+i).value);
        }
    }

    //ช่วงหาร 
    L(X, interpolatePoint, nPoints) {
        var numerate = 1/*ตัวเศษ*/, denominate = 1/*ส่วน*/;
        for (var i=1 ; i<=nPoints ; i++) {
            if (i !== interpolatePoint) {
                numerate *= x[i]-X;
                denominate *= x[i] - x[interpolatePoint];  
            }
        } 
        console.log(numerate/denominate)
        return parseFloat(numerate/denominate);
    }
    // ใช้  L, initialValue()
    lagrange(interpolatePoint, X) {
        fx = 0
        this.initialValue()
        for (var i=1 ; i<=interpolatePoint ; i++) {
            fx += this.L(X, i, interpolatePoint)*y[i];
        }
        this.setState({
            showOutput: true
        })
        // console.log(fx);
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
          document.getElementById("x" + i ).value = api.arrayX[i - 1];
          document.getElementById("y" + i).value = api.arrayY[i - 1];
        }
        for (let i = 1; i <= api.interpolateinput; i++) {
          document.getElementById("p" + i ).value = api.interpolatePoint[i - 1];
        }
        this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X));
      }


    render() {
        return (
            <div style={{ background: "#F5DEB3", padding: "30px", textAlign: "center" }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Lagrange Interpolation</h1>
                <div className="row" >
                    <div className="col">

                        {/* 1  nPoints  X  interpolatePoint*/}
                        {this.state.showInput &&
                            <Card>
                                <h2>
                                    Number of points : &nbsp;&nbsp;
                                        <input size="large" name="nPoints" value={this.state.nPoints} style={{ width: 300 }} onChange={this.valueChange} />
                                </h2>
                                <br></br>

                                <h2>
                                    interpolatePoint &nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       <input size="large" name="interpolatePoint" value={this.state.interpolatePoint} style={{ width: 300 }} onChange={this.valueChange} />
                                </h2>
                                <br></br>

                                <h2>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <input size="large" name="X" value={this.state.X} style={{ width: 300 }} onChange={this.valueChange} />
                                </h2>
                                <br></br>





                                <button id="dimention_button" onClick={() => { this.createTableInput(parseInt(this.state.nPoints)); this.createInterpolatePointInput() }}
                                    style={{ width: 100, height: 45, background: "#008080", color: "white" }}>
                                    Enter
                                </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button id="btn_ex" onClick={() => this.dataapi()}
                                    style={{ width: 100, height: 45, background: "#008080", color: "white" }}>
                                    Ex
                                </button>
                            </Card>
                        }

                        {/* 2  tempTag  tableTag*/}
                        {this.state.showTable && 
                            <div >
                                <br />
                                <Table columns={columns} dataSource={ tableTag} pagination={false} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black", overflowY: "scroll", minWidth: 80, maxHeight: 300 }}></Table>
                                <br /><h2>
                                    {parseInt(this.state.interpolatePoint) === 2 ? "(Linear)" :
                                        parseInt(this.state.interpolatePoint) === 3 ? "(Quadratic)" :
                                            "(Polynomial)"}</h2>

                                <div> {tempTag}</div>
                                <br /><br />
                                <button
                                    id="matrix_button" size="large"
                                    style={{ width: 150, height: 45, color: 'black', background: "orange" }}
                                    onClick={() => this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X))}>
                                    Submit
                         </button>
                            </div>


                        }

                        <br /><br /><br />
                    </div>
                    <div className="col">
                        {this.state.showOutput &&
                            <Card
                                title={"Output"}
                                bordered={true}
                                style={{ background: "while" }}
                            >
                                <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "red" }}>{fx}</h3>

                            </Card>
                        }
                    </div>

                </div>


            </div>
        );
    }
}
export default Lagrange;