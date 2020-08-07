import accounting from 'accounting';
import cx from 'classnames';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ObjectString {
	[key: string]: string;
}

export const valToString = (obj: any): ObjectString => {
	const cloned = { ...obj };
	Object.keys(cloned).forEach(k => {
		if (typeof cloned[k] === 'object') {
			return valToString(cloned[k]);
		}
		cloned[k] = '' + cloned[k];
	});
	return cloned;
}

export const gateType = (type: string) => {
	const classes = [
		'px-2',
		'py-1',
		'text-white',
		'rounded',
		'd-inline'
	];
	let text = '';
	switch (type) {
		case 'in':
			classes.push('bg-primary');
			text = 'Masuk';
			break;
		case 'out':
			classes.push('bg-danger');
			text = 'Keluar';
			break;
		default:
			return type;
	}
	return <div className={cx(classes)}>{text}</div>;
}

export const switchType = (type: boolean) => {
	const classes = [];
	let text: JSX.Element;
	switch (type) {
		case true:
			classes.push('text-success');
			text = <FaCheckCircle />;
			break;
		case false:
			classes.push('text-danger');
			text = <FaTimesCircle />;
			break;
		default:
			return type;
	}
	return <div className={cx(classes)} style={{ fontSize: '1.4rem' }}>{text}</div>;
}

accounting.settings = {
	currency: {
		symbol: 'Rp',
		format: '%s %v',
		decimal: ',',
		thousand: '.',
		precision: 0
	},
	number: {
		precision: 0,
		thousand: '.',
		decimal: ','
	}
}
export const number = accounting;