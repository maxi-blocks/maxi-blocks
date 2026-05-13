export const RESPONSIVE_BREAKPOINTS = [
	'general',
	'xxl',
	'xl',
	'l',
	'm',
	's',
	'xs',
];

const MAX_DEBUG_STRING_LENGTH = 500;
const MAX_DEBUG_OBJECT_KEYS = 80;
const MAX_DEBUG_ARRAY_ITEMS = 40;
const MAX_DEBUG_ELEMENT_SNAPSHOTS = 40;
const MAX_DEBUG_LOG_KEYS = 30;

const DISPLAY_DEBUG_SELECTORS = [
	'svg',
	'img',
	'video',
	'button',
	'[class*="grid"]',
	'[class*="container"]',
	'[class*="row"]',
	'[class*="column"]',
	'[class*="wrapper"]',
	'[class*="content"]',
];

export const stringifyDebugValue = value => {
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
};

const getObjectChunks = (obj, chunkSize = MAX_DEBUG_LOG_KEYS) => {
	const keys = Object.keys(obj || {}).sort();
	const chunks = [];

	for (let i = 0; i < keys.length; i += chunkSize) {
		chunks.push(
			Object.fromEntries(
				keys.slice(i, i + chunkSize).map(key => [key, obj[key]])
			)
		);
	}

	return chunks;
};

export const logDebugObject = (label, payload) => {
	console.info(`MaxiBlocks ${label}: ${stringifyDebugValue(payload)}`);
};

export const logDebugObjectChunks = (label, payload) => {
	const chunks = getObjectChunks(payload);

	chunks.forEach((chunk, index) => {
		logDebugObject(`${label} ${index + 1}/${chunks.length}`, chunk);
	});
};

const sanitizeDebugValue = (value, depth = 0, seen = new WeakSet()) => {
	if (typeof value === 'string') {
		if (value.length <= MAX_DEBUG_STRING_LENGTH) return value;

		return {
			__type: 'string',
			length: value.length,
			preview: `${value.slice(0, MAX_DEBUG_STRING_LENGTH)}...`,
		};
	}

	if (
		value === null ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return value;
	}

	if (typeof value === 'undefined') return '[undefined]';

	if (typeof value !== 'object') return String(value);

	if (seen.has(value)) return '[Circular]';
	seen.add(value);

	if (depth >= 4) {
		return Array.isArray(value) ? `[Array(${value.length})]` : '[Object]';
	}

	if (Array.isArray(value)) {
		return {
			__type: 'array',
			length: value.length,
			items: value
				.slice(0, MAX_DEBUG_ARRAY_ITEMS)
				.map(item => sanitizeDebugValue(item, depth + 1, seen)),
			...(value.length > MAX_DEBUG_ARRAY_ITEMS && {
				__truncatedItems: value.length - MAX_DEBUG_ARRAY_ITEMS,
			}),
		};
	}

	const keys = Object.keys(value).sort();
	const response = {};

	keys.slice(0, MAX_DEBUG_OBJECT_KEYS).forEach(key => {
		response[key] = sanitizeDebugValue(value[key], depth + 1, seen);
	});

	if (keys.length > MAX_DEBUG_OBJECT_KEYS) {
		response.__truncatedKeys = keys.length - MAX_DEBUG_OBJECT_KEYS;
	}

	return response;
};

const getBreakpointAttributeInfo = key => {
	for (const breakpoint of RESPONSIVE_BREAKPOINTS) {
		const hoverSuffix = `-${breakpoint}-hover`;
		if (key.endsWith(hoverSuffix)) {
			return {
				breakpoint,
				baseKey: `${key.slice(0, -hoverSuffix.length)}-hover`,
				state: 'hover',
			};
		}

		const suffix = `-${breakpoint}`;
		if (key.endsWith(suffix)) {
			return {
				breakpoint,
				baseKey: key.slice(0, -suffix.length),
				state: 'normal',
			};
		}
	}

	return null;
};

export const getResponsiveAttributeAudit = attributes => {
	const byBreakpoint = RESPONSIVE_BREAKPOINTS.reduce((acc, breakpoint) => {
		acc[breakpoint] = {};

		return acc;
	}, {});
	const matrix = {};
	const nonResponsiveAttributes = {};
	let responsiveAttributeCount = 0;

	if (!attributes) {
		return {
			totalAttributeCount: 0,
			responsiveAttributeCount,
			matrix,
			byBreakpoint,
			nonResponsiveAttributes,
		};
	}

	Object.keys(attributes)
		.sort()
		.forEach(key => {
			const sanitizedValue = sanitizeDebugValue(attributes[key]);
			const breakpointInfo = getBreakpointAttributeInfo(key);

			if (!breakpointInfo) {
				nonResponsiveAttributes[key] = sanitizedValue;
				return;
			}

			responsiveAttributeCount += 1;

			const { breakpoint, baseKey, state } = breakpointInfo;

			if (!matrix[baseKey]) {
				matrix[baseKey] = {
					state,
				};
			}

			matrix[baseKey][breakpoint] = sanitizedValue;
			byBreakpoint[breakpoint][key] = sanitizedValue;
		});

	return {
		totalAttributeCount: Object.keys(attributes).length,
		responsiveAttributeCount,
		matrix,
		byBreakpoint,
		nonResponsiveAttributes,
	};
};

const getDebugDocuments = () => {
	if (typeof document === 'undefined') return [];

	const documents = [document];

	Array.from(
		document.querySelectorAll(
			'iframe[name="editor-canvas"], .block-editor-iframe__scale-container iframe'
		)
	).forEach(iframe => {
		try {
			if (
				iframe.contentDocument &&
				!documents.includes(iframe.contentDocument)
			) {
				documents.push(iframe.contentDocument);
			}
		} catch {
			// Ignore cross-origin iframe access.
		}
	});

	return documents;
};

const getSelectedBlockElement = (clientId, uniqueID) => {
	for (const currentDocument of getDebugDocuments()) {
		const blockElement = currentDocument.querySelector(
			`[data-block="${clientId}"]`
		);
		if (blockElement) return blockElement;

		if (uniqueID) {
			const uniqueElement =
				currentDocument.getElementsByClassName(uniqueID)[0];
			if (uniqueElement) return uniqueElement;
		}
	}

	return null;
};

const getRoundedRect = element => {
	const rect = element.getBoundingClientRect();

	return {
		x: Number(rect.x.toFixed(1)),
		y: Number(rect.y.toFixed(1)),
		width: Number(rect.width.toFixed(1)),
		height: Number(rect.height.toFixed(1)),
		top: Number(rect.top.toFixed(1)),
		left: Number(rect.left.toFixed(1)),
	};
};

const getElementSnapshot = (element, label) => {
	const view = element.ownerDocument?.defaultView || window;
	const style = view.getComputedStyle(element);

	return {
		label,
		tag: element.tagName.toLowerCase(),
		className: element.getAttribute('class') || '',
		id: element.getAttribute('id') || '',
		inlineStyle: element.getAttribute('style') || '',
		rect: getRoundedRect(element),
		display: style.display,
		position: style.position,
		boxSizing: style.boxSizing,
		width: style.width,
		height: style.height,
		minWidth: style.minWidth,
		maxWidth: style.maxWidth,
		minHeight: style.minHeight,
		maxHeight: style.maxHeight,
		margin: style.margin,
		padding: style.padding,
		gap: style.gap,
		gridTemplateColumns: style.gridTemplateColumns,
		gridTemplateRows: style.gridTemplateRows,
		flexDirection: style.flexDirection,
		alignItems: style.alignItems,
		justifyContent: style.justifyContent,
		overflow: style.overflow,
		transform: style.transform,
		fontSize: style.fontSize,
		lineHeight: style.lineHeight,
	};
};

export const getDisplayDebugSnapshot = (clientId, uniqueID) => {
	const rootElement = getSelectedBlockElement(clientId, uniqueID);

	if (!rootElement) {
		return {
			found: false,
			elements: [],
		};
	}

	const elements = [getElementSnapshot(rootElement, 'selected block')];
	const seen = new WeakSet([rootElement]);

	DISPLAY_DEBUG_SELECTORS.some(selector => {
		const matches = Array.from(rootElement.querySelectorAll(selector));

		return matches.some(element => {
			if (seen.has(element)) return false;

			seen.add(element);
			elements.push(getElementSnapshot(element, selector));

			return elements.length >= MAX_DEBUG_ELEMENT_SNAPSHOTS;
		});
	});

	return {
		found: true,
		elements,
	};
};
