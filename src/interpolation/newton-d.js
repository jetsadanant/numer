import React, { Component } from 'react'
import {Input, Table} from 'antd';
import '../screen.css';
import 'antd/dist/antd.css';
import Plot from 'react-plotly.js';
import math from 'mathjs';

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
var x, y,tableTag,  interpolatePoint, tempTag, fx

class NewtonD extends Component {
    
    constructor() {
        super();
        x = []
        y = []
        interpolatePoint = []
        tempTag = []
        tableTag = []
        this.state = {
            nPoints: 6,
            interpolatePoint: 6,
            X: 3.2,

            showGraph: false,
            showTable: false
        }
        //this.handleChange = this.handleChange.bind(this);
        //this.newton_difference = this.newton_difference.bind(this);
    
    }  
    createTableInput = (n) => {
        if (this.state.interpolatePoint > this.state.nPoints) {
            window.alert("interpolatePoint < nPoints");
        } else{
        x = []
        y = []
        tableTag = []
        tempTag = []
        for (var i=1 ; i<=n ; i++) {
            x.push(<Input style={{
                width: "50%",
                height: "50%", 
                backgroundColor:"#bec5cb", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }}
            id={"x"+i} key={"x"+i} placeholder={"x"+i}  defaultValue={parseInt(1*i)}/>);
            y.push(<Input style={{
                width: "50%",
                height: "50%", 
                backgroundColor:"#bec5cb", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"y"+i} key={"y"+i} placeholder={"y"+i} defaultValue={parseInt(math.random(-10,10))} />);   
            tableTag.push({
                no: i,
                x: x[i-1],
                y: y[i-1]
            });
        
            
        }
        for (var i=1 ; i<=this.state.interpolatePoint ; i++) {
            tempTag.push(<Input style={{
                width: "14%",
                height: "50%", 
                backgroundColor:"#bec5cb", 
                marginInlineEnd: "2%", 
                marginBlockEnd: "2%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"p"+i} key={"p"+i} placeholder={"p"+i} defaultValue={i}/>)
        }


        this.setState({

            showTable: true

        })
    }

    }

    initialValue = () => {
        x = []
        y = []


        interpolatePoint['x'] = []
        interpolatePoint['y'] = []


        for (var i=1 ; i<=this.state.nPoints ; i++) {
            x[i] = parseFloat(document.getElementById("x"+i).value);
            y[i] = parseFloat(document.getElementById("y"+i).value);
        }
        for (i=1 ; i<=this.state.interpolatePoint ; i++) {
            interpolatePoint[i] = parseInt(document.getElementById("p"+i).value);


            interpolatePoint['x'][i] = x[interpolatePoint[i]].toFixed(8);
            interpolatePoint['y'][i] = y[interpolatePoint[i]].toFixed(8);

        }
    }
    C = (n) => {
        if (n === 1) {
            return 0
        }
        else {
            return ((y[interpolatePoint[n]] - y[interpolatePoint[n-1]]) / (x[interpolatePoint[n]] - x[interpolatePoint[n-1]])) - this.C(n-1)
        }
        
    }
    findX = (n, X) => {
        if (n < 1) {
            return 1
        }
        else {
            console.log(X + " - " + x[interpolatePoint[n]])
            return (X - x[interpolatePoint[n]]) * this.findX(n-1, X)
        }
    }
    newton_difference = (n, X) => {
        this.initialValue()
        fx = y[1]
        if (n === 2) { //if linear interpolate
            fx += ((y[interpolatePoint[2]] - y[interpolatePoint[1]]) / (x[interpolatePoint[2]] - x[interpolatePoint[1]]))*(X-x[interpolatePoint[1]])
        }
        else {
            for (var i=2 ; i<=n ; i++) {
                fx += (this.C(i) / (x[interpolatePoint[i]] - x[interpolatePoint[1]])) * this.findX(i-1, X)
            }            
        }

        this.setState({
            showGraph: true
        })

    } 


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        return(
            <div class="content">
            <div class="container-fluid">
                
                <alert color="danger"><h1><p className="text-danger">NEWTON DIVIDE DIFFERENCE</p></h1></alert>
                
                <div class="card">
                        <div class="card-body">
                            <form>
                                <div class="form-row" onChange={this.handleChange}>

                                
                                    <div class="form-group col-md-12">
                                        <label for="nPoints"> <p className="text-danger">NUMBER OF POINTS (N)</p></label>
                                        <input type="text" class="form-control" name="nPoints" placeholder="6" value={this.state.nPoints}/>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label for="interpolatePoint"><p className="text-danger">INTERPOLATEPOINT</p></label>
                                        <input type="text" class="form-control" name="interpolatePoint" placeholder="6" value={this.state.interpolatePoint}/>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="X"><p className="text-danger">X</p></label>
                                        <input type="text" class="form-control" name="X" placeholder="3.2" value={this.state.X}/>
                                    </div>


                                </div>
                            </form>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-danger btn-lg btn-block" onClick= {
                                ()=>{this.createTableInput(parseInt(this.state.nPoints))
                                }
                            }>ENTER</button>
                        </div>
                </div>
                

                <br />

                {this.state.showTable &&
                <div class="card">
                    <div class="card-body">
                    <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "black" , overflowY: "scroll"}}></Table>
                            <br/><h2><p className="text-danger">interpolatePoint {parseInt(this.state.interpolatePoint) === 2 ? "(Linear)": 
                                                       parseInt(this.state.interpolatePoint) === 3 ? "(Quadratic)" :
                                                       "(Polynomial)"} </p></h2><h2>{tempTag}</h2>
                    <div class="card-footer">
                            <button class="btn btn-danger btn-lg btn-block" onClick= {
                                ()=>this.newton_difference(parseInt(this.state.interpolatePoint), parseFloat(this.state.X))
                            }>ENTER</button>
                    </div>                    
                    </div>
                </div>
                }


                <br />

                {this.state.showGraph &&
                <div class="card">
                    <div class="card-body">
                    <Plot
                                data={[
                            
                                {
                                    x: x,
                                    y: y,
                                    name: "Table",
                                    type: 'scatter',
                                    line: {shape: 'spline'},
                                    mode: 'lines',
                                    marker: {color: 'red'},
                                },
                                {
                                    x: interpolatePoint['x'],
                                    y: interpolatePoint['y'],
                                    name: "interpolate",
                                    type: 'scatter',
                                    line: {shape: 'spline',dash: 'dot',
                                    width: 4},
                                    mode: 'lines',
                                    marker: {color: 'blue'},
                                },
                                {
                                    x: [this.state.X],
                                    y: [fx],
                                    name: "Appoximate",
                                    type: 'scatter',
                                    mode: 'markers',
                                    marker: {color: 'orange'},
                                },
                              
                                
                                ]}
                                layout={ {title: 'Newton Divide Difference'} }
                                
                                style={{width: "100%", float:"left", height: "370px"}}
                            />  
                    </div>
                </div>
                }
                
                <br />

                {this.state.showGraph &&
                <div class="card">
                    <div class="card-body">
                        
                <p className="text-danger" style={{fontSize: "24px", fontWeight: "bold"}}>x = {this.state.X}</p>
                        <p className="text-danger" style={{fontSize: "24px", fontWeight: "bold"}}>F(x) = {fx}</p>
 
                    </div>
                </div>
                }

            </div>
            
                    </div>  
        );
    }
}
export default NewtonD;



