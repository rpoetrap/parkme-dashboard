import { useRouter } from 'next/router';
import { useState, FormEvent, useEffect } from 'react';
import { NextPage } from 'next';
import { Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import cx from 'classnames';

import Web from '../../layouts/Web';
import FormInput from '../../components/FormInput';
import styles from './styles.module.scss';
import authResource from '../../resources/auth';
import configResource from '../../resources/config';
import { APIErrors, GlobalProps, Pagination } from '../../types';

interface Props extends GlobalProps {
	logo: string;
}

const LoginPage: NextPage<Props> = (props: Props) => {
	const { logo } = props;
	const router = useRouter();
  const [username, setUsername] = useState({ value: '', error: false, errorMessage: '' });
	const [password, setPassword] = useState({ value: '', error: false, errorMessage: '' });
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setLoading(true);
			const postData = {
				username: username.value ? username.value : undefined,
				password: password.value ? password.value : undefined
			}
			const result = await authResource.login(postData);
			if (!result) throw null;
			if (result.error && result.error.errors) throw result.error.errors;
			router.push('/');
		} catch (err) {
			if (err && err.length) {
				const errors = err as APIErrors[];
				errors.map(item => {
					switch(item.location) {
						case 'username':
							setUsername(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
						case 'password':
							setPassword(getter => ({ ...getter, error: true, errorMessage: item.message }));
							break;
					}
				});
			}
			Swal.fire({
				title: 'Login gagal',
				icon: 'error'
			});
			setLoading(false);
		}
	}

  return (
    <Web
      title="Login"
			className={styles.container}
			config={props.config}
    >
      <div className={styles.background}></div>
      <div className={styles.login_container}>
        <div className={styles.login_form}>
          <img src={logo} />
          <form onSubmit={onSubmit}>
            <h3 className={styles.title}>Login</h3>
						<div className={cx(styles['row'], styles['mb-2'])}>
            	<FormInput type="text" placeholder="Username" setter={setUsername} getter={username} />
						</div>
						<div className={cx(styles['row'], styles['mb-2'])}>
            	<FormInput type="password" placeholder="Password" setter={setPassword} getter={password} />
						</div>
            <button disabled={loading}>
							{loading ? (
								<Spinner color="light" size="sm"/>
							) : 'Login'}
						</button>
          </form>
        </div>
        <div className={styles.footer}>
          Powered by <span className={styles['text-primary']}>ParkMe</span> 2020
				</div>
      </div>
    </Web>
  )
}

LoginPage.getInitialProps = async () => {
	const fetchConfig = async () => {
		try {
			const pagination: Pagination = { pageIndex: 1, itemsPerPage: 1, currentItemCount: 1, totalItems: 1, totalPages: 1, sorts: '', filters: 'key==logo' }
			const result = await configResource.getList(pagination);
			if (!result) throw null;
			if (result.error) throw result.error;
			if (result.data?.items?.length == 0) throw null;
			const { data } = result;
			return data.items[0].value;
		} catch {
			return null;
		}
	}

	const logo = await fetchConfig() || '/assets/img/logo.png';
	return { logo }
}

export default LoginPage;