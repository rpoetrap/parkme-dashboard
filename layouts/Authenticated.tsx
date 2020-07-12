import React, { ReactNode, FunctionComponent } from 'react'
import Head from 'next/head'
import { FaBell, FaCog, FaHome, FaParking, FaUserFriends, FaAddressCard, FaSignOutAlt } from 'react-icons/fa';
import { ReactSVG } from 'react-svg';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import cx from 'classnames';

import styles from './styles.module.scss';

interface Props {
  children?: ReactNode
  title?: string
  style?: React.CSSProperties
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: FaHome,
    link: '/'
  },
  {
    label: 'Barrier Gates',
    icon: FaParking,
    link: '/gates'
  },
  {
    label: 'Users',
    icon: FaUserFriends,
    link: '/users'
  },
  {
    label: 'Cards',
    icon: FaAddressCard,
    link: '/cards'
  },
]

const Authenticated: FunctionComponent<Props> = (props: Props) => {
  const { children, title, style } = props;
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{title ? `${title} | ParkMe` : 'ParkMe'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        <div className={styles.sidebar}>
          <div className={styles.user_tooltip}>
            <button type="button" className={styles.notification}>
              <FaBell className={styles.icon} />
              <span className={styles.notification_count}>99+</span>
            </button>
            <button type="button" className="p-0">
              <FaCog className={cx(styles.icon, 'text-primary')} />
            </button>
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
            <h3>Nama Saya</h3>
          </div>
          {/* Menu Items */}
          <div className={styles.menu}>
            {menuItems.map((menu, idx) => {
              const isActive = router.pathname == menu.link;
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
          <button className={styles.logout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        <div className={styles.content} style={style}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Authenticated
