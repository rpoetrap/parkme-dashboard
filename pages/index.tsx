import Link from 'next/link'
import Web from '../layouts/Web'

const IndexPage = () => (
  <Web title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a className="btn btn-sm btn-primary">About</a>
      </Link>
    </p>
  </Web>
)

export default IndexPage
