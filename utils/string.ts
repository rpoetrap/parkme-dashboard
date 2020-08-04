interface ObjectString {
	[key: string]: string;
}

export const valToString = (obj: any): ObjectString => {
	Object.keys(obj).forEach(k => {
		if (typeof obj[k] === 'object') {
			return valToString(obj[k]);
		}
		obj[k] = '' + obj[k];
	});
	return obj;
}