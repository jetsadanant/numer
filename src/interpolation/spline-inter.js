import React, { Component } from 'react';
import { Card, Input, Button, Row, Col, Table } from 'antd';
import 'antd/dist/antd.css';
import { compile } from 'mathjs';
import { Layout, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
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
var x = [],
    y = [],
    Interpolation = [],
    fx = " ",
    datatable = [];

class Lagrage extends Component {

    constructor() {
        super();
        x = []
        y = []
        datatable = []
        Interpolation = []
        this.state = {
            interpolatePoint: 0,
            showanswer: false,
            showTableButton: false,
            Point: 0,
            X: 0
        }
        this.valueChange = this.valueChange.bind(this);
        this.lagrange = this.lagrange.bind(this);
    }


    createTableInput(n) {
        for (var i = 1; i <= n; i++) {
            x.push(<Input style={{
                width: "100%",
                height: "50%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"x" + i} key={"x" + i} placeholder={"x" + i} />);
            y.push(<Input style={{
                width: "100%",
                height: "50%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
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
            showInputForm: false,
            showInputButton: false,
            showTableInput: true,
            showTableButton: true
        })
    }
    Value(X) {
        x = []
        y = []
        for (var i = 0; i < this.state.nPoints; i++) {
            x[i] = parseFloat(document.getElementById("x" + (i + 1)).value);
            y[i] = parseFloat(document.getElementById("y" + (i + 1)).value);
        }
        // answer = this.spline(X, x, y)
    }



    lagrange(n, X) {
        fx = 0
        this.Value()
        for (var i = 1; i <= n; i++) {

            fx += this.find(X, i, n) * y[i];
        }

        this.setState({
            showanswer: true
        })

    }
    valueChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        return (
            <Router>
                <Layout>
                    <Content
                        style={{
                            background: '#FFCC66',
                            padding: 24,
                            margin: 30,
                            minHeight: 280,
                            fontSize: 24
                        }}
                        onChange={this.handleChange}
                    >
                        <Row gutter={[40, 40]}
                        >
                            <Col span={10} offset={7}>
                                {this.state.showTableInput &&
                                    <div>
                                        <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black", overflowY: "scroll", minWidth: 120, maxHeight: 300 }}>

                                        </Table>
                                    </div>}

                                {this.state.showInputForm &&
                                    <div>
                                        <h2>Number of points(n)</h2><Input size="large" name="Number"></Input>
                                        <h2>X</h2><Input size="large" name="X"></Input>
                                    </div>
                                }
                                <br></br>
                                {this.state.showInputButton &&
                                    <Button id="dimention_button" onClick={
                                        () => { this.createTableInput(parseInt(this.state.nPoints)) }
                                    }
                                        style={{ fontSize: "20px" }}>
                                        Submit<br></br>
                                    </Button>
                                }
                                {this.state.showTableButton &&
                                    <Button
                                        id="matrix_button"
                                        style={{ fontSize: "20px" }}
                                        onClick={() => this.Value(parseFloat(this.state.X))}>
                                        Submit
                            </Button>
                                }
                            </Col>

                        </Row>
                        {/*-----------------------------------------ปุ่มINPUTสมการ----------------------------------------------------*/}

                        <br></br>

                        {/*---------------------------------------------------------------------------------------------*/}
                        <Row>
                            <Col span={10} offset={7}>
                                <Card
                                    title={"Output"}
                                    bordered={true}
                                    style={{ width: "100%", float: "inline-start", marginBlockStart: "2%" }}
                                    id="outputCard"
                                >
                                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>X = {answer}</p>
                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Router>
        );
    }
}
export default Appc;