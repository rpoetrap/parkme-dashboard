import React, { ReactNode, FunctionComponent, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

import styles from './styles.module.scss';
import authResource from '../resources/auth';
import { GlobalProps } from '../types';
import Preloader from '../components/Preloader';

interface Props extends GlobalProps {
	children?: ReactNode
	title?: string
	style?: React.CSSProperties
	className?: string
}

const Web: FunctionComponent<Props> = (props: Props) => {
	const { children, title, style, className } = props;
	const router = useRouter();
	styles;

	const [loading, setLoading] = useState(true);

	const checkStatus = async () => {
		try {
			setLoading(true);
			const result = await authResource.nonauthCheck();
			if (!result) throw null;
			if (result.error) router.push('/');
		} catch {
			Swal.fire({ icon: 'error', title: 'Failed to check auth status !' });
			setLoading(false)
		}
	}

	useEffect(() => {
		checkStatus();
	}, []);

	return (
		<div>
			<Head>
				<title>{title ? `${title} | ParkMe` : 'ParkMe'}</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<main className={className} style={style}>
				{loading ? <Preloader /> : children}
			</main>
		</div>
	)
}

export default Web
