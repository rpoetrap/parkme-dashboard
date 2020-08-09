import { FunctionComponent } from 'react';
import { Spinner } from 'reactstrap';

interface Props {

}

const Preloader: FunctionComponent<Props> = (props: Props) => {
	const { } = props;
	return (
		<div className="d-flex justify-content-center align-items-center vw-100 vh-100" style={{ backgroundColor: '#e9ecef' }}>
			<Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
		</div>
	)
}

export default Preloader;