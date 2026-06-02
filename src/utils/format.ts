export const formatNumberViVN = (value: number): string =>
	new Intl.NumberFormat('vi-VN').format(value);

export const formatCurrency = (value: number): string =>
	`${formatNumberViVN(value)}đ`;

export const formatCountdownMMSS = (seconds: number): string => {
	const safeSeconds = Math.max(0, seconds);
	const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
	const remainSeconds = (safeSeconds % 60).toString().padStart(2, '0');

	return `${minutes}:${remainSeconds}`;
};

export const formatTimeHHMM = (date = new Date()): string =>
	date.toLocaleTimeString('vi-VN', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

export const formatDateTimeViVN = (date = new Date()): string =>
	date.toLocaleString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
