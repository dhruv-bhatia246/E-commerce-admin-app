import React from 'react';
import Layout from '../../components/layout';
import { Jumbotron, Row, Col, Container } from 'react-bootstrap';
import './style.css';
import { NavLink } from 'react-router-dom';

/**
* @author
* @function Home
**/

const Home = (props) => {

  return (
    <Layout sidebar>
      <Jumbotron style={{margin: '5rem', background: 'white'}} className="text-center">
        <h1>Welcome to Admin Dashboard</h1>
        {/* <p> 
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit mollitia ipsa voluptatem esse, enim optio impedit ex recusandae architecto voluptate in sunt natus voluptas ratione magni eveniet deserunt corporis commodi. </p> */}
      </Jumbotron>
    </Layout>
  )
}
export default Home