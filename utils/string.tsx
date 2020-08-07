import accounting from 'accounting';
import cx from 'classnames';

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