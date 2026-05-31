const trim = (value: any) => {
	if (typeof value === 'string') return value.replace(/[ ]{2,}/g, ' ').trim();
	return value;
};

export const chuanHoaObject = (obj: any) => {
	if (!obj) return obj;
	if (typeof obj !== 'object') return trim(obj);
	Object.keys(obj).forEach((key) => (obj[key] = chuanHoaObject(obj[key])));
	return obj;
};
