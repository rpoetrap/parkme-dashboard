import { FunctionComponent } from "react";
import Link from "next/link";
import Head from "next/head";

interface Props {

}

const GenericError: FunctionComponent<Props> = (props: Props) => {
	const { } = props;
	return (
		<>
			<Head>
				<title>Error | ParkMe</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div className="vw-100 vh-100 d-flex flex-column align-items-center justify-content-center">
				<h1>404</h1>
				<div className="mb-2">Halaman tidak ditemukan</div>
				<Link href={'/'}>
					<a className="btn btn-primary">Kembali</a>
				</Link>
			</div>
		</>
	)
}

export default GenericError;