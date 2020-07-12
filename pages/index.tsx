import Link from 'next/link'
import Authenticated from '../layouts/Authenticated'
import { FunctionComponent } from 'react'

interface Props {

}

const IndexPage: FunctionComponent<Props> = (props: Props) => {
  const { } = props;
  return (
    <Authenticated title="Dashboard">
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">
          <a className="btn btn-sm btn-primary">About</a>
        </Link>
      </p>
    </Authenticated>
  )
}

export default IndexPage
