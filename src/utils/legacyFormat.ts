export function currencyFormat(num?: number) {
	if (!num) return '0';
	return num?.toFixed(0)?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') ?? '0';
}

export const convert4NumberScoreToAlphabet = (score: string | number): string => {
	const scoreValue = Number(score);
	if (scoreValue === 4) return 'A+';
	else if (scoreValue >= 3.7) return 'A';
	else if (scoreValue >= 3.5) return 'B+';
	else if (scoreValue >= 3) return 'B';
	else if (scoreValue >= 2.5) return 'C+';
	else if (scoreValue >= 2) return 'C';
	else if (scoreValue >= 1.5) return 'D+';
	else if (scoreValue >= 1) return 'D';
	else if (scoreValue >= 0) return 'F';
	else return '';
};

export const convertNumberScoreToAlphabet = (score: string | number): [string, string] => {
	if (!score) return ['', ''];
	const scoreValue = Math.round(Number(score) * 10) / 10;
	let numberScore = -1;
	if (scoreValue >= 9.0 && scoreValue <= 10) numberScore = 4;
	else if (scoreValue >= 8.5) numberScore = 3.7;
	else if (scoreValue >= 8.0) numberScore = 3.5;
	else if (scoreValue >= 7.0) numberScore = 3;
	else if (scoreValue >= 6.5) numberScore = 2.5;
	else if (scoreValue >= 5.5) numberScore = 2;
	else if (scoreValue >= 5.0) numberScore = 1.5;
	else if (scoreValue >= 4.0) numberScore = 1;
	else if (scoreValue >= 0) numberScore = 0;

	return [convert4NumberScoreToAlphabet(numberScore), numberScore.toString()];
};

export const tienVietNam = (number: number) => {
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

export const inputFormat = (value?: number): string => `${value}`.replace(/(?=(\d{3})+(?!\d))\B/g, ',');

export const inputParse = (value?: string): number => +(value?.replace(/\₫\s?|(,*)[^\d]/g, '') ?? 0);
