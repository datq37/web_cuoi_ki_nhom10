import { EDinhDangFile } from '@/services/base/constant';
import { message } from 'antd';
import { type AxiosResponse } from 'axios';
import * as XLSX from 'xlsx';

export function getNameFile(url: string): string {
	if (typeof url !== 'string') return 'Đường dẫn không đúng';
	return decodeURI(url.split('/')?.at(-1) ?? '');
}

export function renderFileListUrl(url: string) {
	if (!url) return { fileList: [] };
	return {
		fileList: [
			{
				name: getNameFile(url),
				url,
				status: 'done',
				size: 0,
				type: 'img/png',
				remote: true,
			},
		],
	};
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

export function renderFileListUrlWithName(url: string, fileName?: string) {
	if (!url) return { fileList: [] };
	return {
		fileList: [
			{
				name: fileName || getNameFile(url),
				remote: true,
				url,
				status: 'done',
				size: 0,
				type: 'img/png',
			},
		],
	};
}

export function renderFileList(arr: string[]) {
	if (!arr || !Array.isArray(arr)) return { fileList: [] };
	return {
		fileList: arr.map((url, index) => ({
			remote: true,
			name: getNameFile(url) || `File ${index + 1}`,
			url,
			status: 'done',
			size: 0,
			type: 'img/png',
		})),
	};
}

export const checkFileSize = (arrFile: any[], fileSize?: number) => {
	let check = true;
	const size = fileSize ?? 8;
	arrFile
		?.filter((item) => item?.remote !== true)
		?.forEach((item) => {
			if (item?.size / 1024 / 1024 > size) {
				check = false;
				message.error(`file ${item?.name} có dung lượng > ${size}Mb`);
			}
		});
	return check;
};

export const b64toBlob = (b64Data?: string, contentType = '', sliceSize = 512) => {
	if (!b64Data) return undefined;
	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });
	return blob;
};

export const blobToBase64 = (file: Blob): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

export const genExcelFile = (data: (string | number | null | undefined)[][], fileName: string, sheetName?: string) => {
	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.aoa_to_sheet(data);
	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName ?? 'Sheet1');

	XLSX.writeFile(workbook, fileName || 'Danh sách.xlsx');
};

export const getFilenameHeader = (response: AxiosResponse<any>) => {
	const token = String(response.headers['content-disposition'])
		.split(';')
		.find((a) => a.startsWith('filename='));
	if (!token) {
		return 'Tài liệu';
	} else {
		return decodeURIComponent(token.substring(10).slice(0, -1));
	}
};
