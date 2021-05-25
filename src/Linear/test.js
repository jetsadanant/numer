import React, { useState } from "react";
import { Table, Button, Input, Layout } from "antd";
import axios from "axios";
const { Header, Content, Sider } = Layout;
const math = require("mathjs");
let A = [],
  B = [],
  X = [],
  matrixA = [],
  matrixB = [],
  matrixX = [],
  dimention;
function Jacobi() {
  const [sinput, setSinput] = useState(true);
  const [sans, setSans] = useState(false);
  const [smatrix, setSmatrix] = useState(false);
  const [ans, setAns] = useState([]);
  const columns = [
    {
      title: "Iteration",
      dataIndex: "x",
      key: "x",
    },
    {
      title: "Value",
      dataIndex: "Value",
      key: "Value",
    },
  ];
  function clear() {
    dimention = 0;
    setSinput(true);
    setSans(false);
    setSmatrix(false);
    setAns([]);
    A = [];
    B = [];
    matrixA = [];
    matrixB = [];
    X = [];
    matrixX = [];
  }
  function creatematrix() {
    for (let i = 1; i <= dimention; i++) {
      for (let j = 1; j <= dimention; j++) {
        A.push(
          <Input
            style={{
              margin: "0%",
              marginLeft: "5%",
              width: "6%",
              height: "9%",
              backgroundColor: "white",
              marginInlineEnd: "5%",
              marginBlockEnd: "5%",
              color: "black",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            id={"a" + i + "" + j}
            key={"a" + i + "" + j}
            placeholder={"a" + i + "" + j}
          />
        );
      }
      X.push(
        <Input
          style={{
            marginLeft: "5%",
            width: "30%",
            height: "9%",
            backgroundColor: "white",
            marginInlineEnd: "5%",
            marginBlockEnd: "5%",
            color: "black",
            fontSize: "18px",
            fontWeight: "bold",
            margin: "15%",
          }}
          id={"x" + i}
          key={"x" + i}
          placeholder={"x" + i}
        />
      );
      B.push(
        <Input
          style={{
            marginLeft: "5%",
            width: "30%",
            height: "9%",
            backgroundColor: "white",
            marginInlineEnd: "5%",
            marginBlockEnd: "5%",
            color: "black",
            fontSize: "18px",
            fontWeight: "bold",
            margin: "15%",
          }}
          id={"b" + i}
          key={"b" + i}
          placeholder={"b" + i}
        />
      );
      A.push(<br />);
    }
    setSinput(false);
    setSmatrix(true);
  }
  async function exa() {
    let xx = await axios({
      method: "get",
      url: "http://localhost:4000/conjugate",
    })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return undefined;
      });
    console.log(xx);
    if (xx !== undefined) {
      let y = xx.col;
      dimention = y;
      matrixA = xx.A;
      matrixB = xx.B;
      matrixX = xx.X;
      console.log(matrixA);
      console.log(matrixB);
      console.log(matrixX);
      for (let i = 0; i < dimention; i++) {
        for (let j = 0; j < dimention; j++) {
          A.push(
            <Input
              style={{
                margin: "0%",
                marginLeft: "5%",
                width: "6%",
                height: "9%",
                backgroundColor: "white",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              id={"a" + (i + 1) + "" + (j + 1)}
              key={"a" + (i + 1) + "" + (j + 1)}
              value={matrixA[i][j]}
            />
          );
        }
        A.push(<br />);
        X.push(
          <Input
            style={{
              marginLeft: "5%",
              width: "30%",
              height: "9%",
              backgroundColor: "white",
              marginInlineEnd: "5%",
              marginBlockEnd: "5%",
              color: "black",
              fontSize: "18px",
              fontWeight: "bold",
              margin: "15%",
            }}
            id={"x" + (i + 1)}
            key={"x" + (i + 1)}
            value={matrixX[i]}
          />
        );
        B.push(
          <Input
            style={{
              marginLeft: "5%",
              width: "30%",
              height: "9%",
              backgroundColor: "white",
              marginInlineEnd: "5%",
              marginBlockEnd: "5%",
              color: "black",
              fontSize: "18px",
              fontWeight: "bold",
              margin: "15%",
            }}
            id={"b" + (i + 1)}
            key={"b" + (i + 1)}
            value={matrixB[i]}
          />
        );
        X.push(<br />);
        B.push(<br />);
      }
      setSinput(false);
      setSmatrix(true);
      console.log(matrixA);
      console.log(matrixB);
    }
  }
  function cal() {
    init();
    let error;
    let loop = true;
    let tranform = JSON.parse(JSON.stringify(matrixA));
    let tranform1 = JSON.parse(JSON.stringify(matrixX));
    let tranform2 = JSON.parse(JSON.stringify(matrixB));
    var lamda, tranr1, alpha;
    var tranposed;
    var matrixr0 = math.subtract(math.multiply(tranform, tranform1), tranform2);
    var matrixd0 = math.unaryMinus(matrixr0);
    for (let i = 0; i < dimention; i++) {
      ans.push({
        x: "X" + (i + 1),
        Value: tranform1[i],
      });
    }
    while (loop) {
      tranposed = math.transpose(matrixd0);
      lamda = math.unaryMinus(
        math.divide(
          math.multiply(tranposed, matrixr0),
          math.multiply(math.multiply(tranposed, tranform), matrixd0)
        )
      );
      tranform1 = math.add(tranform1, math.multiply(matrixd0, lamda));
      matrixr0 = math.subtract(math.multiply(tranform, tranform1), tranform2);
      tranr1 = math.transpose(matrixr0);
      error = math.sqrt(math.multiply(tranr1, matrixr0));
      alpha = math.divide(
        math.multiply(tranr1, math.multiply(tranform, matrixd0)),
        math.multiply(tranposed, math.multiply(tranform, matrixd0))
      );
      matrixd0 = math.add(
        math.unaryMinus(matrixr0),
        math.multiply(matrixd0, alpha)
      );
      console.log(tranform1);
      error = error.toFixed(6);
      for (let i = 0; i < dimention; i++) {
        ans.push({
          x: "X" + (i + 1),
          Value: tranform1[i],
        });
      }
      if (error <= 0.0000001) {
        loop = false;
      }
    }
    setSans(true);
  }
  function init() {
    for (var i = 0; i < dimention; i++) {
      matrixA[i] = [];
      for (var j = 0; j < dimention; j++) {
        matrixA[i][j] = parseFloat(
          document.getElementById("a" + (i + 1) + "" + (j + 1)).value
        );
      }
      matrixB[i] = parseFloat(document.getElementById("b" + (i + 1)).value);
      matrixX[i] = parseFloat(document.getElementById("x" + (i + 1)).value);
    }
  }
  return (
    <>
      <h1 style={{ margin: "1%", fontSize: "56px" }}>Conjugate Gradient</h1>
      <Layout style={{ background: "white", padding: "0%" }}>
        {sinput && (
          <div>
            <Input
              style={{
                margin: "0%",
                marginTop: "5%",
                marginLeft: "5%",
                width: "30%",
                height: "40%",
                backgroundColor: "white",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              name="dimention"
              onChange={e => (dimention = e.target.value)}
            />
            <Button onClick={() => creatematrix()}>Create Matrix</Button>
            <Button onClick={() => exa()}>Example</Button>
          </div>
        )}
        {smatrix && (
          <Layout style={{ marginLeft: "10%" }}>
            <Layout>
              <Header style={{ background: "white", paddingLeft: "18%" }}>
                <Button onClick={() => cal()}>Calculate</Button>
                <Button onClick={() => clear()} style={{ marginLeft: "2%" }}>
                  Clear
                </Button>
              </Header>
            </Layout>
            <Layout>
              <Content style={{ background: "white" }}>
                <div>
                  <p style={{ marginLeft: "22%" }}>Metrix A</p>
                  <br />
                  {A}
                </div>
              </Content>
              <Sider style={{ background: "white" }}>
                <p style={{ marginLeft: "20%" }}>Metrix X</p>
                <br />
                <div>{X}</div>
              </Sider>
              <Sider style={{ background: "white" }}>
                <div>
                  <p style={{ marginLeft: "30%" }}>Metrix B</p>
                  <br />
                  {B}
                </div>
              </Sider>
            </Layout>
          </Layout>
        )}
        {sans && (
          <div>
            <Table columns={columns} dataSource={ans} />
          </div>
        )}
      </Layout>
    </>
  );
}

export default Jacobi;
