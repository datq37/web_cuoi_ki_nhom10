export const handleScrollToDivElementById = (id: string, delay?: number) => {
	if (delay) {
		setTimeout(() => {
			const targetDiv = document.getElementById(id);
			if (targetDiv) {
				targetDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}, delay);
	} else {
		const targetDiv = document.getElementById(id);
		if (targetDiv) {
			targetDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
};

export const copyToClipboard = (text: string, callBack?: () => void) => {
	navigator.clipboard
		.writeText(text)
		.then(function () {
			if (callBack) callBack();
		})
		.catch(function (err) {
			console.error('Could not copy text: ', err);
		});
};
