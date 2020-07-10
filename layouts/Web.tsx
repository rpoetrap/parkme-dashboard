import React, { ReactNode, FunctionComponent } from 'react'
import Head from 'next/head'

interface Props {
  children?: ReactNode
  title?: string
  style?: React.CSSProperties
  className?: string
}

const Web: FunctionComponent<Props> = (props: Props) => {
  const { children, title, style, className } = props;
  return <div>
    <Head>
      <title>{title ? `${title} | ParkMe` : 'ParkMe'}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <main className={className ? `container-fluid ${className}` : 'container-fluid'} style={style}>
      {children}
    </main>
  </div>
}

export default Web
