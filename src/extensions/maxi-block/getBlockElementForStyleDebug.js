const escapeClassSelector = (doc, value) => {
	const stringValue = `${value}`;
	const cssEscape = doc?.defaultView?.CSS?.escape;

	if (typeof cssEscape === 'function') return cssEscape(stringValue);

	return stringValue.replace(/[^a-zA-Z0-9_-]/g, char => `\\${char}`);
};

const escapeAttributeValue = value =>
	`${value}`.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const querySelectorSafely = (doc, selector) => {
	try {
		return doc?.querySelector?.(selector) || null;
	} catch (error) {
		return null;
	}
};

const getBlockElementForStyleDebug = (doc, uniqueID) => {
	if (!doc || !uniqueID) {
		return {
			element: null,
			method: null,
		};
	}

	const idElement = doc.getElementById?.(uniqueID) || null;
	if (idElement) {
		return {
			element: idElement,
			method: 'id',
		};
	}

	const escapedClass = escapeClassSelector(doc, uniqueID);
	const escapedAttribute = escapeAttributeValue(uniqueID);
	const lookups = [
		{
			method: 'backendClass',
			selector: `.maxi-block.maxi-block--backend.${escapedClass}`,
		},
		{
			method: 'class',
			selector: `.${escapedClass}`,
		},
		{
			method: 'uniqueIDAttr',
			selector: `[uniqueID="${escapedAttribute}"]`,
		},
		{
			method: 'uniqueidAttr',
			selector: `[uniqueid="${escapedAttribute}"]`,
		},
	];

	for (const lookup of lookups) {
		const element = querySelectorSafely(doc, lookup.selector);

		if (element) {
			return {
				element,
				method: lookup.method,
			};
		}
	}

	return {
		element: null,
		method: null,
	};
};

export default getBlockElementForStyleDebug;
