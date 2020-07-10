import App from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';

class CoreApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />
  }
}

export default CoreApp;