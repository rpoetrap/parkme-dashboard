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