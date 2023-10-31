export function getNumbersFromString(value: string) {
	return value.replace(/(\D)/g, '').replace(/(\d)/, '$1');
}

export function removeSpacesFromString(value: string) {
	return value.replace(/\s/g, '');
}

export function getBase64MimeTypeAndValue(base64: string) {
	const [dataType, b64] = base64.split(',');
	return {
		base64: b64,
		mimeType: dataType.replace(/(data:|;|base64)/g, ''),
	};
}
