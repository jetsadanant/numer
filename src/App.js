
import './App.css';
import './index.css';
import 'antd/dist/antd.css';
import React, { Component } from 'react'
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Bisection from './Root/bisection';
import False from './Root/false';
import Newton from './Root/newton';
import Secant from './Root/secant';
import One from './Root/one';
import Cramer from './Linear/cramer';
import Gauss from './Linear/guass';
import Jordan from './Linear/jordan';
import Jacobi from './Linear/jacobi';
// import Seidel from './Linear/seident';
import Luu from './Linear/lu';
import Gradient from './Linear/conjugate';
import NewtonD from './interpolation/newton-d';
import Lagrange from './interpolation/lagrage';
import Linears from './regression/linear-r';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Route, Link, BrowserRouter } from 'react-router-dom';
import {
  UserOutlined, LaptopOutlined, NotificationOutlined, BankOutlined
} from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;


class App extends Component {

  render() {

    return (
      
      <BrowserRouter>
        <Layout>
          <Header className="header">
            <h1 style={{ color: 'white', textAlign: 'center' }}>Numerical Methods</h1>
          </Header>
            <Layout className="site-layout-background" >
                <Menu
                  mode="horizontal"
                  style={{ width: '100%', background: '#333366', color: 'white' ,textAlign:'center',padding:'15px' ,fontFamily:"25px"}}
                >
                  <SubMenu key="sub1" icon={<UserOutlined/>} title="Root of Equation">
                    <Menu.Item key="1"><Link to="/bisection">Bisection</Link> </Menu.Item>
                    <Menu.Item key="2"><Link to="/false">False-Position</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/one">One-point Iteration</Link></Menu.Item>
                    <Menu.Item key="4"><Link to="/newton">Newtonraphson</Link></Menu.Item>
                    <Menu.Item key="5"><Link to="/secant">Secant</Link></Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" icon={<LaptopOutlined />} title="Linear Equation">
                    <Menu.Item key="6"><Link to="/cramer">Cramer's Rule</Link></Menu.Item>
                    <Menu.Item key="7"><Link to="/guass">Guass Elimination</Link></Menu.Item>
                    <Menu.Item key="8"><Link to="/jordan">Guass-Jordan</Link></Menu.Item>
                    <Menu.Item key="9"><Link to="/lu">LU</Link></Menu.Item> 
                     {/* <Menu.Item key="10"><Link to="/cholesky">Cholesky</Link></Menu.Item> */}
                     <Menu.Item key="12"><Link to="/conjugate">Conjugate</Link></Menu.Item> 
                    <Menu.Item key="11"><Link to="/jacobi">Jacobi</Link></Menu.Item>
                     {/* <Menu.Item key="12"><Link to="/seident">Seidel</Link></Menu.Item>  */}
                  </SubMenu>
                  <SubMenu key="sub3" icon={<NotificationOutlined />} title="Interpolation">
                    <Menu.Item key="13"><Link to="/newton-d">Newton Divided-differences</Link></Menu.Item>
                    <Menu.Item key="14"><Link to="/lagrage">Lagrage Polynomial</Link></Menu.Item>
                    {/* <Menu.Item key="15">Spline Interpolation</Menu.Item> */}
                  </SubMenu>
                  <SubMenu key="sub4" icon={<UserOutlined/>} title="Regression">
                    <Menu.Item key="16"><Link to="/linear-r">Linear Regression</Link></Menu.Item>
                    {/* <Menu.Item key="17">Polynomials Regression</Menu.Item> */}
                    {/* <Menu.Item key="18">Multiple Linear Regression</Menu.Item> */}
                  </SubMenu>
                </Menu>

              <Content>
                {/* root */}
                <Route path="/bisection" component={Bisection} />
                <Route path="/false" component={False} />
                <Route path="/newton" component={Newton} />
                <Route path="/one" component={One} />
                <Route path="/secant" component={Secant} />

                {/* linear */}
               <Route exact path="/cramer" component={Cramer} /> 
                 <Route exact path="/guass" component={Gauss} />
                <Route exact path="/jordan" component={Jordan} />
                <Route exact path="/jacobi" component={Jacobi} />  
                <Route exact path="/conjugate" component={Gradient} />  
                <Route exact path="/lu" component={Luu} />  
                {/* <Route exact path="/seident" component={Seidel} />   */}
    
               {/* interpolation */}
               <Route exact path="/newton-d" component={NewtonD} />              
               <Route exact path="/lagrage" component={Lagrange} />
               
               {/* Regress */}
               <Route exact path="/linear-r" component={Linears} /> 
              </Content>
            </Layout>
         
            <p>
          {process.env.DIDYOUSEE}
        </p>
        </Layout>
      </BrowserRouter>
    );
  }
}


export default App;
