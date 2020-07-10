import { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

import Web from '../../layouts/Web';

class Login extends Component {
  render() {
    return (
      <Web
        title="Login"
        className="p-0 d-flex justify-content-end"
        style={{
          backgroundColor: '#0C203A',
          minHeight: '100vh'
        }}>
        <div style={{
          backgroundImage: `url(/assets/img/background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          filter: 'blur(10px)',
          minHeight: '100vh',
          minWidth: '100vw',
          position: 'absolute'
        }}></div>
        <div
          className="col-sm-12 col-md-3 bg-white d-flex flex-column px-5"
          style={{
            borderTopLeftRadius: '32px',
            borderBottomLeftRadius: '32px'
          }}
        >
          <div className="d-flex flex-column my-auto">
            <img className="align-self-center mb-4" src="/assets/img/logo.png" style={{ maxWidth: '60%' }} />
            <Form className="mt-3 font-weight-light">
              <h3 className="mb-3">Login</h3>
              <Form.Control className="font-weight-light mb-2" type="text" placeholder="Email Address" />
              <Form.Control className="font-weight-light mb-2" type="password" placeholder="Password" />
              <Button block className="mt-4">Login</Button>
            </Form>
          </div>
          <div className="align-self-center pb-3 text-black-50">
            Powered by <span className="text-primary">ParkMe</span> 2020
          </div>
        </div>
      </Web>
    )
  }
}

export default Login;