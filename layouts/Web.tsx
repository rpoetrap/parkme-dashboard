import React, { ReactNode, FunctionComponent, useContext, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

import styles from './styles.module.scss';
import { StateUserContext, DispatchUserContext } from '../dispatcher/user';
import authResource from '../resources/auth';
import Preloader from '../components/Preloader';

interface Props {
  children?: ReactNode
  title?: string
  style?: React.CSSProperties
  className?: string
}

const Web: FunctionComponent<Props> = (props: Props) => {
	const { children, title, style, className } = props;
	const router = useRouter();
  styles;
  const stateUser = useContext(StateUserContext);
	const dispatchUser = useContext(DispatchUserContext);
	
	const checkStatus = async () => {
		try {
			const result = await authResource.nonauthCheck();
			if (!result) throw null;
			if (result.error) router.push('/');
			else dispatchUser({ type: 'logout' });
		} catch {
			Swal.fire({ icon: 'error', title: 'Failed to check auth status !' });
      dispatchUser({ type: 'logout' });
		}
	}

	useEffect(() => {
    if (!stateUser.logout) {
      checkStatus();
    }
  }, []);

  return (
		<div>
			<Head>
				<title>{title ? `${title} | ParkMe` : 'ParkMe'}</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<main className={className} style={style}>
				{!stateUser.logout ? <Preloader/> : children}
			</main>
		</div>
	)
}

export default Web
