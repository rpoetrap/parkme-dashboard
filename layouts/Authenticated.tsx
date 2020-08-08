import React, { ReactNode, FunctionComponent, useState, useEffect, useContext, MouseEvent } from 'react'
import Head from 'next/head'
import { FaBell, FaCog, FaHome, FaParking, FaUserFriends, FaAddressCard, FaSignOutAlt, FaUserLock, FaFileAlt } from 'react-icons/fa';
import { ReactSVG } from 'react-svg';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import cx from 'classnames';
import moment from 'moment';
import { Spinner } from 'reactstrap';

import styles from './styles.module.scss';
import authResource from '../resources/auth';
import Preloader from '../components/Preloader';
import Swal from 'sweetalert2';
import { GlobalProps } from '../types';

interface Props extends GlobalProps {
	children?: ReactNode;
	title?: string;
	style?: React.CSSProperties;
	loading?: boolean;
}

const menuItems = [
	{
		label: 'Dashboard',
		icon: FaHome,
		link: '/'
	},
	{
		label: 'Palang Parkir',
		icon: FaParking,
		link: '/gates'
	},
	{
		label: 'Users',
		icon: FaUserFriends,
		link: '/users'
	},
	{
		label: 'Hak Akses',
		icon: FaUserLock,
		link: '/card-access'
	},
	{
		label: 'Kartu',
		icon: FaAddressCard,
		link: '/cards'
	},
]

const Authenticated: FunctionComponent<Props> = (props: Props) => {
	const { children, title, style, loading: pageLoading, config: { user } } = props;

	const router = useRouter();
	let timeInterval: number;

	const [time, setTime] = useState(moment());
	const [loading, setLoading] = useState({ page: false, fetch: false });

	const checkAuth = async () => {
		try {
			setLoading(loading => ({ ...loading, page: true }));
			const result = await authResource.authCheck();
			if (!result) throw null;
			if (result.error) throw result.error.errors;

			const userInfo = await authResource.getUserInfo();
			if (!userInfo) throw null;
			if (userInfo.error) throw userInfo.error.errors;

			// setcookie
		} catch {
			router.push('/login');
		} finally {
			setLoading(loading => ({ ...loading, page: false }));
		}
	}

	const logout = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			e.preventDefault();
			setLoading(loading => ({ ...loading, fetch: true }));
			const result = await authResource.logout();
			if (!result) throw null;
			if (result.error) throw result.error.errors;

			// delete cookie
			router.push('/login');
		} catch {
			Swal.fire({
				title: 'Error',
				icon: 'error'
			});
			setLoading(loading => ({ ...loading, fetch: false }));
		}
	}

	useEffect(() => {
		checkAuth();
	}, [user]);

	useEffect(() => {
		checkAuth();
		timeInterval = setInterval(() => {
			setTime(moment()), 1000;
		});
	}, []);

	return (
		<div>
			<Head>
				<title>{title ? `${title} | ParkMe` : 'ParkMe'}</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<main>
				{loading.page || pageLoading ? <Preloader /> : (
					<>
						<div className={styles.sidebar}>
							<div className={styles.user_tooltip}>
								{/* <button type="button" className={styles.notification}>
									<FaBell className={styles.icon} />
									<span className={styles.notification_count}>99+</span>
								</button> */}
								<Link href="/config">
									<a className={styles['p-0']}>
										<FaCog className={cx(styles.icon, 'text-primary')} />
									</a>
								</Link>
							</div>
							{/* User Profile */}
							<div className={styles.user_profile}>
								<div className={styles.user_picture}>
									{/* Placeholder */}
									<div className={styles.placeholder}>
										<ReactSVG src="/assets/img/avatar.svg" />
									</div>
									{/* Image */}
									{/* <img></img> */}
								</div>
								<h5 className={styles.caption}>Halo,</h5>
								<h4>{user?.name}</h4>
							</div>
							{/* Menu Items */}
							<div className={styles.menu}>
								{menuItems.map((menu, idx) => {
									const pathArray = router.pathname.split('/').filter(item => item !== '');
									const menuLinkArray = menu.link.split('/').filter(item => item !== '');
									const isActive = router.pathname == menu.link || pathArray.length > 0 ? pathArray[0] == menuLinkArray[0] : false;
									const itemClass = [styles.menu_item];
									if (isActive) itemClass.push(styles.active);
									return (
										<Link href={menu.link} key={idx}>
											<a className={cx(itemClass)}>
												<div className={styles.icon}>
													<menu.icon />
												</div>
												<span className={styles.label}>{menu.label}</span>
											</a>
										</Link>
									);
								})}
							</div>
							<button className={styles.logout} disabled={loading.fetch} onClick={logout}>
								<FaSignOutAlt />
								{loading.fetch ? <Spinner className={styles['ml-3']} color="light" /> : <span>Logout</span>}
							</button>
						</div>
						<div className={styles.content} style={style}>
							<div className={styles['mb-4']}>
								<h2 className={styles.title}>{title}</h2>
								<div className={styles.time}>
									{time.format('DD MMMM YYYY HH:mm')}
								</div>
							</div>
							{children}
						</div>
					</>
				)}
			</main>
		</div>
	)
}

export default Authenticated
