import { Component } from 'react';

import Web from '../../layouts/Web';
import styles from './styles.module.scss';

class Login extends Component {
  render() {
    return (
      <Web
        title="Login"
        className={styles.container}
      >
        <div className={styles.background}></div>
        <div className={styles.login_container}>
          <div className={styles.login_form}>
            <img src="/assets/img/logo.png" />
            <form>
              <h3 className={styles.title}>Login</h3>
              <input type="text" placeholder="Email Address" />
              <input type="password" placeholder="Password" />
              <button>Login</button>
            </form>
          </div>
          <div className={styles.footer}>
            Powered by <span className="text-primary">ParkMe</span> 2020
          </div>
        </div>
      </Web>
    )
  }
}

export default Login;