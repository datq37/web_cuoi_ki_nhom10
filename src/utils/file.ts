import { EDinhDangFile } from '@/services/base/constant';

export function getNameFile(url: string): string {
	if (typeof url !== 'string') return 'Đường dẫn không đúng';
	return decodeURI(url.split('/')?.at(-1) ?? '');
}

export function getFileType(mimeType: string) {
	if (!mimeType) return EDinhDangFile.UNKNOWN;

	const mimeGroups: Record<string, string[]> = {
		[EDinhDangFile.WORD]: [
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
			'application/vnd.ms-word.document.macroEnabled.12',
			'application/vnd.ms-word.template.macroEnabled.12',
			'application/msword',
			'doc',
			'docx',
		],
		[EDinhDangFile.EXCEL]: [
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
			'application/vnd.ms-excel.sheet.macroEnabled.12',
			'application/vnd.ms-excel.template.macroEnabled.12',
			'application/vnd.ms-excel.addin.macroEnabled.12',
			'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
			'xls',
			'xlsx',
		],
		[EDinhDangFile.POWERPOINT]: [
			'application/vnd.ms-powerpoint',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'application/vnd.openxmlformats-officedocument.presentationml.template',
			'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
			'application/vnd.ms-powerpoint.addin.macroEnabled.12',
			'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
			'application/vnd.ms-powerpoint.template.macroEnabled.12',
			'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
			'ppt',
			'pptx',
		],
		[EDinhDangFile.PDF]: ['application/pdf'],
		[EDinhDangFile.IMAGE]: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
		[EDinhDangFile.VIDEO]: ['video/mp4', 'video/avi', 'video/mpeg'],
		[EDinhDangFile.AUDIO]: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
		[EDinhDangFile.TEXT]: ['text/plain', 'text/csv', 'text/html'],
	};

	let result: EDinhDangFile = EDinhDangFile.UNKNOWN;
	for (const [fileType, mimeList] of Object.entries(mimeGroups)) {
		if (mimeList.some((mime) => mime.includes(mimeType))) {
			result = fileType as EDinhDangFile;
			break;
		}
	}

	return result;
}
