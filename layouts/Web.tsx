import React, { ReactNode, FunctionComponent } from 'react'
import Head from 'next/head'

import styles from './styles.module.scss';

interface Props {
  children?: ReactNode
  title?: string
  style?: React.CSSProperties
  className?: string
}

const Web: FunctionComponent<Props> = (props: Props) => {
  const { children, title, style, className } = props;
  styles;
  
  return <div>
    <Head>
      <title>{title ? `${title} | ParkMe` : 'ParkMe'}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <main className={className} style={style}>
      {children}
    </main>
  </div>
}

export default Web
