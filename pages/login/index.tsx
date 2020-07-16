import { FunctionComponent, useState } from 'react';

import Web from '../../layouts/Web';
import FormInput from '../../components/FormInput';
import styles from './styles.module.scss';

interface Props {

}
const LoginPage: FunctionComponent<Props> = (props: Props) => {
  const { } = props;
  const [email, setEmail] = useState({ value: '', error: false, errorMessage: '' });
  const [password, setPassword] = useState({ value: '', error: false, errorMessage: '' });

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
            <FormInput type="text" placeholder="Email Address" setter={setEmail} getter={email} />
            <FormInput type="password" placeholder="Password" setter={setPassword} getter={password} />
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

export default LoginPage;