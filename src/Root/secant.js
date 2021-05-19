// import React, { Component } from 'react';
// import { Input, Typography, Button, Table } from 'antd';
// import { range, compile, evaluate, simplify, parse, abs, derivative } from 'mathjs'
// import axios from 'axios';


// var dataTable = []
// const columns = [
//   {
//     title: "Iteration",
//     dataIndex: "iteration",
//     key: "iteration"
//   },
//   {
//     title: "x",
//     dataIndex: "x",
//     key: "x"
//   },
//   {
//     title: "Error",
//     key: "error",
//     dataIndex: "error"
//   }
// ];

// class Secant extends Component {
//   constructor() {
//     super();
//     this.state = {
//       fx: "",
//       x0: 0,
//       x1: 0,
//       showTable: false,

//     }
//     this.valueChange = this.valueChange.bind(this);
//     this.secant = this.secant.bind(this);
//   }

//   function(x) {
//     let scope = { x: parseFloat(x) };
//     var expr = compile(this.state.fx);
//     return expr.evaluate(scope)
//   }

//   error(y, x[i]) {
//     return Math.abs((y - x[i]) / y);
//   }

//   createTable(x, error) {
//     dataTable = []
//     var i = 0;
//     for (i = 1; i < error.length; i++) {
//       dataTable.push({
//         key: i,
//         iteration: i,
//         x: x[i],
//         error: error[i],
//       });
//     }

//   }

//   valueChange(event) {
//     this.setState({
//       [event.target.name]: event.target.value
//     });
//   }


//   secant(x0, x1) {
//     var x0 = this.state.x0;
//     var x1 = this.state.x1;
//     var x = [], y = 0
//     var error = parseFloat(0.000000);
//     var n = 1, i = 1;
//     var inputdata = []
//     inputdata['x'] = []
//     inputdata['error'] = []
//     x.push(x0);
//     x.push(x1);
//     inputdata['x'][0] = x0;
//     inputdata['error'][0] = "---";

//     do {
//       y = x[i] - (this.function(x[i]) * ((x[i] - x[i - 1]))) / (this.function(x[i]) - this.function(x[i - 1]));
//       x.push(y);
//       error = this.error(y, x[i]);
//       inputdata['y'][n] = y.toFixed(8);
//       inputdata['error'][n] = Math.abs(error).toFixed(8);

//       n++;
//       i++;

//     } while (Math.abs(error) > 0.000001);
//     this.createTable(inputdata['x'], inputdata['error']);
//     this.setState({ showTable: true })
//   }


//   render() {

//     return (
//       <div style={{ background: "#FFFF", padding: "30px" }}>
//         <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Secant Method</h1>


//         <form style={{ textAlign: 'center', fontSize: '21px' }}>
//           <h4>Equation  : &nbsp;&nbsp;
//                       <Input size="large" placeholder="" name="fx" style={{ width: 300 }}
//               onChange={this.valueChange}
//             />
//           </h4>
//           <br></br>
//           <h4>X0 : &nbsp;&nbsp;
//                       <Input size="large" placeholder="" name="x0" style={{ width: 200 }}
//               onChange={this.valueChange}
//             />
//           </h4>
//           <br></br>
//           <h4>X1 : &nbsp;&nbsp;
//                       <Input size="large" placeholder="" name="x1" style={{ width: 200 }}
//               onChange={this.valueChange}
//             />
//           </h4>
//           <br></br>

//           <Button type="submit" size="large" style={{ color: '#ffffff', background: '#008080' }}
//             onClick={() => this.secant}>
//             Enter
//          </Button>
//           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//           <Button type="submit" size="large"style={{ color: '#ffffff', background: '#f7c602' }}
//             onClick={() => this.secant}>
//             Ex
//           </Button>
//         </form>
//         <br></br>
//         <div style={{ margin: "30px" }}>

//           <h4 style={{ textAlign: 'center', fontSize: '30px' }}>
//             <div>
//               F(x) = {this.state.fx}
//               <div>
//                 X0 = {this.state.x0}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  X1 = {this.state.x1}
//               </div>

//             </div>
//           </h4>
//           <div >
//             {this.state.showTable &&
//               <Table columns={columns} dataSource={dataTable} ></Table>
//             }
//           </div>

//         </div >


//       </div>

//     );
//   }
// }
// export default Secant;




