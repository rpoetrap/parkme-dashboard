import App from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
moment.locale('id');

import styles from './styles.module.scss';
styles;

class CoreApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />
  }
}

export default CoreApp;