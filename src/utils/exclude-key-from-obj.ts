function excludeKeyFromObj<T, Key extends keyof T>(obj: T, keys: Key[]) {
	if (Array.isArray(obj)) {
		obj.forEach(function (item) {
			excludeKeyFromObj(item, keys);
		});
	} else if (typeof obj === 'object' && obj != null) {
		Object.getOwnPropertyNames(obj).forEach(function (key) {
			if (keys.indexOf(key as Key) !== -1) delete obj[key];
			else excludeKeyFromObj(obj[key], keys);
		});
	}
}

export { excludeKeyFromObj };
