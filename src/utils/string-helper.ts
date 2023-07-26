export function getNumbersFromString(value: string) {
	return value.replace(/(\D)/g, '').replace(/(\d)/, '$1');
}

export function removeSpacesFromString(value: string) {
	return value.replace(/\s/g, '');
}
