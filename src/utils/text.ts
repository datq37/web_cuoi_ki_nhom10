import moment from 'moment';

export const urlRegex =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.,~#?&//=]*)$/;

const charMap: any = {
	a: '[aàáâãăăạảấầẩẫậắằẳẵặ]',
	e: '[eèéẹẻẽêềềểễệế]',
	i: '[iìíĩỉị]',
	o: '[oòóọỏõôốồổỗộơớờởỡợ]',
	u: '[uùúũụủưứừửữự]',
	y: '[yỳỵỷỹý]',
	d: '[dđ]',
	' ': ' ',
};

export const isUrl = (path: string): boolean => urlRegex.test(path);

export function toHexa(str: string) {
	if (!str) return '';
	const maxBase = 1000000007;
	const base = 16777216;
	let sum = 1;
	for (let i = 0; i < str.length; i += 1) {
		sum = (sum * str.charCodeAt(i)) % maxBase;
	}
	sum %= base;
	const colors = [
		'rgba(26, 94, 18, 0.7)',
		'rgba(84, 106, 47, 0.7)',
		'rgba(107, 143, 36, 0.7)',
		'rgba(45, 77, 0, 0.7)',
		'rgba(0, 100, 0, 0.7)',
		'rgba(47, 79, 79, 0.7)',
		'rgba(0, 128, 128, 0.7)',
		'rgba(0, 139, 139, 0.7)',
		'rgba(100, 149, 237, 0.7)',
	];
	return colors[sum % colors.length];
}

function render(value: string) {
	let result = '';
	[...value].forEach((char: any) => (result += charMap[char] || char));
	return result;
}

export function Format(str: string) {
	if (!str) return '';
	return str
		.toString()
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/đ/g, 'd');
}

export function toRegex(value: any) {
	if (!value) return undefined;
	return { $regex: `.*${render(Format(value))}.*`, $options: 'i' };
}

export function Object2Regex(obj: Record<string, any>) {
	return Object.keys(obj).map((key) => ({
		[key]: { $regex: `.*${render(Format(obj[key]))}.*`, $options: 'i' },
	}));
}

export function trim(str: string) {
	if (moment.isMoment(str)) return str?.toISOString() ?? '';
	if (typeof str === 'string') return str.replace(/[ ]{2,}/g, ' ').trim();
	return str;
}

export function formatPhoneNumber(num: any) {
	const phoneNumber = num.replace(/\D/g, '');

	if (/^0\d{9,10}$/.test(phoneNumber)) {
		if (phoneNumber.length === 10) {
			return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
		} else if (phoneNumber.length === 11) {
			return phoneNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
		}
	}

	return phoneNumber;
}

export function chuanHoaTen(ten: any) {
	return trim(ten)
		.split(' ')
		.map((t: string) => t.charAt(0).toUpperCase() + t.slice(1))
		.join(' ');
}

export const removeHtmlTags = (html: string) =>
	html
		?.replace(/<\/?[^>]+(>|$)/g, '')
		?.replace(/&nbsp;/g, '')
		?.trim();

export const decodeHtmlEntities = (str: string): string => {
	if (str && typeof str === 'string') {
		const element = document.createElement('div');
		let s = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
		s = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
		element.innerHTML = s;
		s = element.textContent || '';
		element.textContent = '';
		return s;
	}
	return '';
};

export const compareFullname = (a: any, b: any): number => {
	if (typeof a !== 'string' || typeof b !== 'string') return 0;
	const tenA = a.split(' ').pop()?.toLocaleLowerCase() ?? '';
	const tenB = b.split(' ').pop()?.toLocaleLowerCase() ?? '';
	const compareTen = tenA.localeCompare(tenB, 'vi');

	return compareTen === 0 ? a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase(), 'vi') : compareTen;
};

export function removeVietnameseTones(str: string, removeSpecial: boolean = false) {
	let strTemp = str;
	strTemp = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
	strTemp = strTemp.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
	strTemp = strTemp.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
	strTemp = strTemp.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
	strTemp = strTemp.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
	strTemp = strTemp.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
	strTemp = strTemp.replace(/đ/g, 'd');
	strTemp = strTemp.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
	strTemp = strTemp.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
	strTemp = strTemp.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
	strTemp = strTemp.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
	strTemp = strTemp.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
	strTemp = strTemp.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
	strTemp = strTemp.replace(/Đ/g, 'D');
	strTemp = strTemp.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
	strTemp = strTemp.replace(/\u02C6|\u0306|\u031B/g, '');

	if (removeSpecial)
		strTemp = strTemp.replace(
			/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
			' ',
		);

	strTemp = strTemp.replace(/ + /g, ' ');
	strTemp = strTemp.trim();

	return strTemp;
}

export const createTextLinks = (text: string, targetBlank: boolean = true) => {
	return removeHtmlTags(text || '').replace(
		/((https?:\/\/(www\.)?)|(www\.))(\S+)/gi,
		function (match, temp, protocol, www1, www2, url) {
			const hyperlink = (protocol ?? 'https://') + url;
			return `<a href="${hyperlink}"${targetBlank ? 'target="_blank" rel="noreferrer"' : ''}>${url}</a>`;
		},
	);
};
