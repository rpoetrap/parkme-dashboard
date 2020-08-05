import accounting from 'accounting';

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