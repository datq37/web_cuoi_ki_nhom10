export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const isAntDesignPro = (): boolean => {
	if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
		return true;
	}
	return window.location.hostname === 'preview.pro.ant.design';
};

export const isAntDesignProOrDev = (): boolean => {
	const { NODE_ENV } = process.env;
	if (NODE_ENV === 'development') {
		return true;
	}
	return isAntDesignPro();
};

export function isValue(val: string | number | any[]) {
	if (!val && val !== 0) return false;
	if (val && Array.isArray(val) && val?.length === 0) return false;
	return true;
}

export const makeId = (length: number) => {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
};

export const range = (start: number, end: number) => {
	const result = [];
	for (let i = start; i < end; i++) {
		result.push(i);
	}
	return result;
};

export const ellipse = (text: string | any[], length: number = 20) => {
	let s = '';
	if (text?.length < length) return text;
	for (let i = 0; i < length; i++) {
		s += text[i];
	}
	s += '...';
	return s;
};
