import { select } from '@wordpress/data';

import getActiveStyleCard from './getActiveStyleCard';

export const BLOCK_DEFAULTS_GROUP = 'blockDefaults';
export const SC_BLOCK_DEFAULTS_UPDATE_EVENT =
	'maxi-blocks:style-card-block-defaults-update';
export const SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES =
	'scBlockDefaultsExcludedAttributes';
const BLOCK_DEFAULT_KEY_SEPARATOR = '|';
const SC_BLOCK_DEFAULTS_META_KEY = '__scBlockDefaults';
const SC_BLOCK_DEFAULTS_DEBUG_LOG_KEY = 'maxiSCBlockDefaultsDebugLog';
const SC_BLOCK_DEFAULTS_DEBUG_LOG_LIMIT = 500;
let latestEditorStyleCardValue = null;
const debugLayoutBlocks = ['container-maxi', 'row-maxi'];
const focusedDebugLabels = [
	'advanced globals change',
	'editor onChangeValue result',
	'editor dispatch block defaults update',
	'block refresh from defaults update',
	'library layout sequence matched',
	'library layout sequence not matched',
];
const layoutDebugAttributePattern =
	/(^|\|)(padding|margin|row-gap|column-gap|flex-wrap|max-width|width|min-width|max-height|height|min-height|full-width|width-fit-content|size-advanced-options)-/;

const isSCBlockDefaultsLocalWampEditor = () =>
	typeof window !== 'undefined' &&
	window.location?.hostname === 'localhost' &&
	window.location?.pathname?.includes('/maxi-blocks-local/');

const isSCBlockDefaultsExplicitDebugEnabled = () =>
	typeof window !== 'undefined' &&
	(window.maxiDebugSCBlockDefaults === true ||
		window.localStorage?.getItem('maxiDebugSCBlockDefaults') === '1');

const isSCBlockDefaultsVerboseDebugEnabled = () =>
	typeof window !== 'undefined' &&
	(isSCBlockDefaultsExplicitDebugEnabled() ||
		window.maxiDebugSCBlockDefaultsVerbose === true ||
		window.localStorage?.getItem('maxiDebugSCBlockDefaultsVerbose') ===
			'1');

export const isSCBlockDefaultsDebugEnabled = () => {
	try {
		return (
			typeof window !== 'undefined' &&
			(isSCBlockDefaultsLocalWampEditor() ||
				isSCBlockDefaultsExplicitDebugEnabled() ||
				isSCBlockDefaultsVerboseDebugEnabled())
		);
	} catch {
		return false;
	}
};

const hasLayoutBlockReference = value => {
	if (!value) return false;
	if (typeof value === 'string')
		return debugLayoutBlocks.some(blockName => value.includes(blockName));
	if (Array.isArray(value)) return value.some(hasLayoutBlockReference);
	if (typeof value === 'object')
		return Object.values(value).some(hasLayoutBlockReference);

	return false;
};

const hasLayoutAttributeReference = value => {
	if (!value) return false;
	if (typeof value === 'string')
		return layoutDebugAttributePattern.test(value);
	if (Array.isArray(value)) return value.some(hasLayoutAttributeReference);
	if (typeof value === 'object')
		return Object.entries(value).some(
			([key, nestedValue]) =>
				hasLayoutAttributeReference(key) ||
				hasLayoutAttributeReference(nestedValue)
		);

	return false;
};

const isFocusedDebugEntry = (label, payload) =>
	focusedDebugLabels.includes(label) ||
	(hasLayoutAttributeReference(payload) &&
		(debugLayoutBlocks.includes(payload?.blockName) ||
			debugLayoutBlocks.includes(payload?.meta?.blockName) ||
			hasLayoutBlockReference(payload?.availableMetaBlocks) ||
			hasLayoutBlockReference(payload?.prefixedValues) ||
			hasLayoutBlockReference(payload?.response)));

export const debugSCBlockDefaults = (label, payload = {}) => {
	if (!isSCBlockDefaultsDebugEnabled()) return;
	if (
		!isSCBlockDefaultsVerboseDebugEnabled() &&
		!isFocusedDebugEntry(label, payload)
	)
		return;

	try {
		const entry = {
			label,
			payload,
			time: new Date().toISOString(),
		};
		const currentLog = Array.isArray(window[SC_BLOCK_DEFAULTS_DEBUG_LOG_KEY])
			? window[SC_BLOCK_DEFAULTS_DEBUG_LOG_KEY]
			: [];

		window[SC_BLOCK_DEFAULTS_DEBUG_LOG_KEY] = [
			...currentLog,
			entry,
		].slice(-SC_BLOCK_DEFAULTS_DEBUG_LOG_LIMIT);
		window.getMaxiSCBlockDefaultsDebugLog = () =>
			window[SC_BLOCK_DEFAULTS_DEBUG_LOG_KEY];
	} catch {
		// Keep console debugging available even when window helpers are blocked.
	}

	// eslint-disable-next-line no-console
	console.info(`[SC block defaults] ${label}`, payload);
};

export const blockDefaultBlocks = [
	'accordion-maxi',
	'button-maxi',
	'column-maxi',
	'container-maxi',
	'divider-maxi',
	'group-maxi',
	'image-maxi',
	'list-item-maxi',
	'map-maxi',
	'number-counter-maxi',
	'pane-maxi',
	'row-maxi',
	'search-maxi',
	'slide-maxi',
	'slider-maxi',
	'svg-icon-maxi',
	'text-maxi',
	'video-maxi',
];

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const styles = ['light', 'dark'];

const shippedBlockDefaults = {
	'container-maxi': {
		'max-width-xxl': '1690',
		'max-width-xl': '1170',
		'max-width-l': '90',
		'max-width-unit-xxl': 'px',
		'max-width-unit-xl': 'px',
		'max-width-unit-l': '%',
		'width-l': '1170',
		'width-m': '1000',
		'width-s': '700',
		'width-xs': '460',
		'width-unit-l': 'px',
		'width-unit-m': 'px',
		'width-unit-s': 'px',
		'width-unit-xs': 'px',
	},
	'row-maxi': {
		'max-width-xxl': '1690',
		'max-width-xl': '1170',
		'max-width-l': '90',
		'max-width-unit-xxl': 'px',
		'max-width-unit-xl': 'px',
		'max-width-unit-l': '%',
	},
};

const libraryLayoutDefaultSequences = {
	'container-maxi': [
		...['padding-top', 'padding-bottom'].flatMap(target => [
			{
				target,
				unit: 'px',
				values: {
					general: '100',
					xxl: '150',
					xl: '100',
				},
			},
			{
				target,
				unit: 'px',
				values: {
					general: '100',
					xxl: '150',
				},
			},
			{
				target,
				unit: 'px',
				values: {
					general: '150',
					xxl: '200',
					xl: '150',
				},
			},
			{
				target,
				unit: 'px',
				values: {
					general: '150',
					xxl: '200',
					xl: '150',
					s: '60',
					xs: '40',
				},
			},
			{
				target,
				unit: 'px',
				values: {
					general: '150',
					xxl: '200',
				},
			},
			{
				target,
				unit: 'px',
				values: {
					general: '150',
					xxl: '200',
					xl: '150',
					l: '120',
					m: '100',
					s: '60',
					xs: '40',
				},
			},
			{
				target,
				unit: 'px',
				values: {
					general: '150',
					l: '120',
					m: '100',
					s: '80',
					xs: '60',
				},
			},
		]),
		...['margin-top', 'margin-bottom'].map(target => ({
			target,
			unit: 'px',
			values: {
				general: '100',
			},
		})),
	],
	'row-maxi': [
		...['padding-top', 'padding-bottom'].flatMap(target => [
			{
				target,
				unit: 'px',
				values: {
					general: '100',
					xxl: '150',
					s: '0',
				},
			},
			{
				target,
				unit: 'px',
				values: {
					general: '150',
					xxl: '200',
					s: '0',
				},
			},
			{
				target,
				unit: 'px',
				values: {
					general: '150',
					xxl: '200',
					xl: '150',
					s: '0',
				},
			},
		]),
		{
			target: 'row-gap',
			unit: 'px',
			values: {
				general: '20',
				xs: '10',
			},
		},
		{
			target: 'column-gap',
			unit: '%',
			values: {
				general: '0',
			},
		},
		{
			target: 'column-gap',
			unit: '%',
			values: {
				m: '2.5',
				s: '2.5',
				xs: '2.5',
			},
		},
		{
			target: 'column-gap',
			unit: '%',
			values: {
				m: '2.5',
				s: '2.5',
			},
		},
		{
			target: 'flex-wrap',
			values: {
				general: 'nowrap',
				xs: 'wrap',
			},
		},
		{
			target: 'flex-wrap',
			values: {
				general: 'wrap',
			},
		},
		{
			target: 'flex-wrap',
			values: {
				general: 'wrap',
				m: 'wrap',
				s: 'wrap',
				xs: 'wrap',
			},
		},
		{
			target: 'flex-wrap',
			values: {
				general: 'wrap',
				m: 'wrap',
				s: 'wrap',
			},
		},
	],
};

const cssLengthTargets = [
	'max-width',
	'min-width',
	'width',
	'max-height',
	'min-height',
	'height',
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'border-top-width',
	'border-right-width',
	'border-bottom-width',
	'border-left-width',
	'border-top-left-radius',
	'border-top-right-radius',
	'border-bottom-right-radius',
	'border-bottom-left-radius',
	'row-gap',
	'column-gap',
];

const libraryLayoutSequenceTargets = [
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'row-gap',
	'column-gap',
	'flex-wrap',
];

export const getBlockDefaultKey = (blockName, attr) =>
	`${blockName}${BLOCK_DEFAULT_KEY_SEPARATOR}${attr}`;

export const parseBlockDefaultKey = key => {
	const separatorIndex = key.indexOf(BLOCK_DEFAULT_KEY_SEPARATOR);

	if (separatorIndex === -1) return null;

	return {
		blockName: key.slice(0, separatorIndex),
		attr: key.slice(separatorIndex + 1),
	};
};

const isValidValue = value =>
	value !== undefined && value !== null && value !== '';

const stringify = value => (isValidValue(value) ? `${value}` : value);

const getDebugBlockDefaultSummary = (blockDefaults, blockName) =>
	Object.entries(blockDefaults ?? {})
		.filter(([key]) => {
			const parsedKey = parseBlockDefaultKey(key);

			return (
				parsedKey?.blockName === blockName &&
				layoutDebugAttributePattern.test(key)
			);
		})
		.slice(0, 40)
		.map(([key, value]) => `${key}=${stringify(value)}`);

const getBreakpoint = attr =>
	breakpoints.find(breakpoint => attr.endsWith(`-${breakpoint}`));

const withoutBreakpoint = attr => {
	const breakpoint = getBreakpoint(attr);
	return breakpoint ? attr.slice(0, -breakpoint.length - 1) : attr;
};

export const getUnitAttribute = attr => {
	if (attr.includes('-unit-')) return null;

	const breakpoint = getBreakpoint(attr);
	const baseAttr = withoutBreakpoint(attr);

	if (!breakpoint || !cssLengthTargets.includes(baseAttr)) return null;

	return `${baseAttr}-unit-${breakpoint}`;
};

const getResponsiveValue = (attributes, target, breakpoint) => {
	const breakpointPosition = breakpoints.indexOf(breakpoint);

	if (breakpointPosition === -1) return undefined;

	for (let i = breakpointPosition; i >= 0; i -= 1) {
		const value = attributes?.[`${target}-${breakpoints[i]}`];
		if (isValidValue(value)) return value;
	}

	return undefined;
};

const getResponsiveSequenceSnapshot = (attributes, target) =>
	breakpoints.reduce((acc, breakpoint) => {
		const attr = `${target}-${breakpoint}`;
		const unitAttr = getUnitAttribute(attr);
		const value = attributes?.[attr];
		const unit = unitAttr ? attributes?.[unitAttr] : undefined;

		if (isValidValue(value) || isValidValue(unit)) {
			acc[breakpoint] = {
				value,
				unit,
			};
		}

		return acc;
	}, {});

const getLibraryLayoutDefaultSequenceMatch = ({
	blockName,
	attr,
	attributes,
}) => {
	const target = withoutBreakpoint(attr);
	const breakpoint = getBreakpoint(attr);

	if (!target || !breakpoint)
		return {
			matched: false,
			reason: 'missing target or breakpoint',
			target,
			breakpoint,
		};

	const candidateSequences = (
		libraryLayoutDefaultSequences[blockName] || []
	).filter(
		({ target: sequenceTarget, values }) =>
			sequenceTarget === target &&
			Object.prototype.hasOwnProperty.call(values, breakpoint)
	);

	const actualValues = getResponsiveSequenceSnapshot(attributes, target);
	let closestCandidate = null;

	for (const candidate of candidateSequences) {
		const { unit, values } = candidate;
		const mismatches = breakpoints.reduce((acc, currentBreakpoint) => {
			const currentAttr = `${target}-${currentBreakpoint}`;
			const currentValue = attributes?.[currentAttr];
			const expectedValue = values[currentBreakpoint];
			const unitAttr = getUnitAttribute(currentAttr);
			const currentUnit = unitAttr ? attributes?.[unitAttr] : null;

			if (expectedValue === undefined) {
				if (isValidValue(currentValue)) {
					acc.push({
						breakpoint: currentBreakpoint,
						actual: currentValue,
						expected: undefined,
						reason: 'unexpected breakpoint value',
					});
				}

				return acc;
			}

			if (
				!isValidValue(currentValue) ||
				stringify(currentValue) !== stringify(expectedValue)
			) {
				acc.push({
					breakpoint: currentBreakpoint,
					actual: currentValue,
					expected: expectedValue,
					reason: 'value mismatch',
				});

				return acc;
			}

			if (
				unit &&
				isValidValue(currentUnit) &&
				stringify(currentUnit) !== stringify(unit)
			) {
				acc.push({
					breakpoint: currentBreakpoint,
					actual: currentUnit,
					expected: unit,
					reason: 'unit mismatch',
				});
			}

			return acc;
		}, []);

		const candidateDetails = {
			unit,
			values,
			mismatches,
		};

		if (!mismatches.length) {
			return {
				...candidateDetails,
				actualValues,
				breakpoint,
				matched: true,
				reason: 'matched library layout sequence',
				target,
			};
		}

		if (
			!closestCandidate ||
			mismatches.length < closestCandidate.mismatches.length
		) {
			closestCandidate = candidateDetails;
		}
	}

	return {
		...(closestCandidate || {}),
		actualValues,
		breakpoint,
		candidateCount: candidateSequences.length,
		matched: false,
		reason: candidateSequences.length
			? 'no library layout sequence matched'
			: 'no library layout sequence configured for attr',
		target,
	};
};

const shouldRespectSizeToggle = (attr, attributes) => {
	const breakpoint = getBreakpoint(attr);
	const baseAttr = withoutBreakpoint(attr);

	if (!breakpoint) return false;

	const isWidthTarget = ['width', 'max-width', 'min-width'].includes(
		baseAttr
	);

	if (!isWidthTarget) return false;

	const fullWidth = getResponsiveValue(attributes, 'full-width', breakpoint);
	const fitContent = getResponsiveValue(
		attributes,
		'width-fit-content',
		breakpoint
	);

	return Boolean(fullWidth || fitContent);
};

export const getSCBlockDefaultsExcludedAttributes = attributes => {
	const value = attributes?.[SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES];

	return Array.isArray(value) ? value : [];
};

export const getSCBlockDefaultsExcludedAttributesUpdate = ({
	attributes,
	attr,
	exclude,
}) => {
	const currentExclusions = getSCBlockDefaultsExcludedAttributes(attributes);
	const nextExclusions = exclude
		? Array.from(new Set([...currentExclusions, attr]))
		: currentExclusions.filter(excludedAttr => excludedAttr !== attr);

	return {
		[SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES]:
			nextExclusions.length > 0 ? nextExclusions : undefined,
	};
};

const isSCBlockDefaultExcluded = (attributes, attr) =>
	getSCBlockDefaultsExcludedAttributes(attributes).includes(attr);

export const normalizeBlockName = value => {
	if (!value) return null;

	const normalizedValue = value.replace('maxi-blocks/', '');
	if (blockDefaultBlocks.includes(normalizedValue)) return normalizedValue;

	return (
		blockDefaultBlocks.find(blockName =>
			normalizedValue.startsWith(`${blockName}-`)
		) || null
	);
};

const sanitizeCssPart = value => value.replace(/[^a-zA-Z0-9-]/g, '-');

export const getBlockDefaultCssVarName = (blockStyle, blockName, attr) =>
	`--maxi-${blockStyle}-block-default-${sanitizeCssPart(
		blockName
	)}-${sanitizeCssPart(attr)}`;

const getBlockDefaults = (styleCard, blockStyle) => ({
	...(styleCard?.[blockStyle]?.defaultStyleCard?.[BLOCK_DEFAULTS_GROUP] ??
		{}),
	...(styleCard?.[blockStyle]?.styleCard?.[BLOCK_DEFAULTS_GROUP] ?? {}),
});

const getBlockDefaultValue = ({ styleCard, blockStyle, blockName, attr }) =>
	getBlockDefaults(styleCard, blockStyle)?.[
		getBlockDefaultKey(blockName, attr)
	];

export const setActiveStyleCardValueForBlockDefaults = styleCard => {
	latestEditorStyleCardValue = styleCard || null;

	debugSCBlockDefaults('active style card snapshot set', {
		hasStyleCard: Boolean(latestEditorStyleCardValue),
		blockDefaultKeys: styles.reduce(
			(acc, blockStyle) => ({
				...acc,
				[blockStyle]: Object.keys(
					getBlockDefaults(latestEditorStyleCardValue, blockStyle)
				),
			}),
			{}
		),
	});
};

const getActiveStyleCardValue = () => {
	if (latestEditorStyleCardValue) return latestEditorStyleCardValue;

	let store = null;

	try {
		store = select('maxiBlocks/style-cards');
	} catch {
		return null;
	}

	const styleCards = store?.receiveMaxiStyleCards?.();

	debugSCBlockDefaults('active style card lookup', {
		hasStore: Boolean(store),
		hasStyleCards: Boolean(styleCards),
		styleCardKeys: styleCards ? Object.keys(styleCards) : [],
	});

	if (!styleCards) return null;

	const activeStyleCard = getActiveStyleCard(styleCards);

	return activeStyleCard?.value;
};

const getShippedDefaultValue = ({ blockName, attr, defaultAttributes }) => {
	if (Object.prototype.hasOwnProperty.call(shippedBlockDefaults, blockName)) {
		const blockDefaults = shippedBlockDefaults[blockName];
		if (Object.prototype.hasOwnProperty.call(blockDefaults, attr))
			return blockDefaults[attr];
	}

	return defaultAttributes?.[attr]?.default;
};

export const getShippedBlockDefault = (blockName, attr, fallback = '') => {
	const value = getShippedDefaultValue({ blockName, attr });

	return isValidValue(value) ? value : fallback;
};

const getFallback = ({ blockName, attr, unitAttr, defaultAttributes }) => {
	const value = getShippedDefaultValue({
		blockName,
		attr,
		defaultAttributes,
	});
	const unit = unitAttr
		? getShippedDefaultValue({
				blockName,
				attr: unitAttr,
				defaultAttributes,
		  })
		: undefined;

	if (!isValidValue(value)) return undefined;

	return `${value}${unit ?? ''}`;
};

const getFallbackValue = ({
	blockName,
	attr,
	unitAttr,
	currentValue,
	value,
	attributes,
	defaultAttributes,
	scUnit,
}) => {
	const fallbackValue = isValidValue(currentValue) ? currentValue : value;
	const fallbackUnit = unitAttr
		? attributes?.[unitAttr] ??
		  getShippedDefaultValue({
				blockName,
				attr: unitAttr,
				defaultAttributes,
		  }) ??
		  scUnit ??
		  ''
		: '';

	return fallbackValue === 'auto'
		? fallbackValue
		: `${fallbackValue}${fallbackUnit}`;
};

const getStyleCardFallbackValue = ({
	blockName,
	attr,
	unitAttr,
	value,
	attributes,
	defaultAttributes,
	scUnit,
}) => {
	const fallbackUnit = unitAttr
		? scUnit ??
		  attributes?.[unitAttr] ??
		  getShippedDefaultValue({
				blockName,
				attr: unitAttr,
				defaultAttributes,
		  }) ??
		  ''
		: '';

	return value === 'auto' ? value : `${value}${fallbackUnit}`;
};

const isAttributeChanged = ({
	attr,
	unitAttr,
	blockName,
	attributes,
	defaultAttributes,
}) => {
	const currentValue = attributes?.[attr];
	const shippedValue = getShippedDefaultValue({
		blockName,
		attr,
		defaultAttributes,
	});
	const hasCurrentValue = isValidValue(currentValue);
	const hasShippedValue = isValidValue(shippedValue);
	const hasLibraryLayoutDefaultSequences = Boolean(
		libraryLayoutDefaultSequences[blockName]?.length
	);
	const isLayoutSequenceTarget = libraryLayoutSequenceTargets.includes(
		withoutBreakpoint(attr)
	) && hasLibraryLayoutDefaultSequences;
	const librarySequenceMatch = isLayoutSequenceTarget
		? getLibraryLayoutDefaultSequenceMatch({
				blockName,
				attr,
				attributes,
		  })
		: null;

	if (hasCurrentValue && librarySequenceMatch?.matched) {
		debugSCBlockDefaults('library layout sequence matched', {
			blockName,
			attr,
			currentValue,
			currentUnit: unitAttr ? attributes?.[unitAttr] : undefined,
			...librarySequenceMatch,
		});

		return false;
	}

	if (hasCurrentValue && isLayoutSequenceTarget) {
		debugSCBlockDefaults('library layout sequence not matched', {
			blockName,
			attr,
			currentValue,
			currentUnit: unitAttr ? attributes?.[unitAttr] : undefined,
			...librarySequenceMatch,
		});
	}

	if (hasCurrentValue && !hasShippedValue && isLayoutSequenceTarget)
		return true;

	if (
		hasCurrentValue &&
		hasShippedValue &&
		stringify(currentValue) !== stringify(shippedValue)
	)
		return true;

	if (unitAttr) {
		const currentUnit = attributes?.[unitAttr];
		const shippedUnit = getShippedDefaultValue({
			blockName,
			attr: unitAttr,
			defaultAttributes,
		});

		if (
			isValidValue(currentUnit) &&
			!isValidValue(shippedUnit) &&
			isLayoutSequenceTarget
		)
			return true;

		if (
			isValidValue(currentUnit) &&
			isValidValue(shippedUnit) &&
			stringify(currentUnit) !== stringify(shippedUnit)
		)
			return true;
	}

	return false;
};

export const applySCBlockDefaultsToAttributes = ({
	response,
	attributes,
	defaultAttributes,
	styleCard: rawStyleCard,
}) => {
	const blockName = normalizeBlockName(
		attributes?.blockName || attributes?.uniqueID
	);
	const blockStyle = ['light', 'dark'].includes(attributes?.blockStyle)
		? attributes.blockStyle
		: null;

	debugSCBlockDefaults('apply start', {
		blockName,
		blockStyle,
		uniqueID: attributes?.uniqueID,
		defaultAttributeKeys: Object.keys(defaultAttributes ?? {}),
	});

	if (!blockName || !blockStyle) return response;

	const styleCard = rawStyleCard || getActiveStyleCardValue();
	if (!styleCard) return response;

	const blockDefaults = getBlockDefaults(styleCard, blockStyle);

	debugSCBlockDefaults('style card values', {
		blockName,
		blockStyle,
		blockDefaultKeys: Object.keys(blockDefaults),
		blockDefaultSummary: getDebugBlockDefaultSummary(
			blockDefaults,
			blockName
		),
	});

	const nextResponse = { ...response };

	Object.keys(defaultAttributes).forEach(attr => {
		if (attr.includes('-unit-')) return;
		if (isSCBlockDefaultExcluded(attributes, attr)) {
			debugSCBlockDefaults('skip explicit block default opt-out', {
				blockName,
				blockStyle,
				attr,
			});
			return;
		}
		if (shouldRespectSizeToggle(attr, attributes)) {
			debugSCBlockDefaults('skip size toggle', {
				blockName,
				blockStyle,
				attr,
				fullWidth: attributes?.[`full-width-${getBreakpoint(attr)}`],
				fitContent:
					attributes?.[`width-fit-content-${getBreakpoint(attr)}`],
			});
			return;
		}

		const unitAttr = getUnitAttribute(attr);
		const attributeChanged = isAttributeChanged({
			attr,
			unitAttr,
			blockName,
			attributes,
			defaultAttributes,
		});

		if (attributeChanged) {
			debugSCBlockDefaults('skip custom value', {
				blockName,
				blockStyle,
				attr,
				currentValue: attributes?.[attr],
				currentUnit: unitAttr ? attributes?.[unitAttr] : undefined,
			});
			return;
		}

		const scValue = getBlockDefaultValue({
			styleCard,
			blockStyle,
			blockName,
			attr,
		});
		const currentValue = attributes?.[attr];
		const hasDefaultLikeCurrentValue = isValidValue(currentValue);
		const value = isValidValue(scValue) ? scValue : currentValue;

		if (!isValidValue(value)) return;

		if (isValidValue(scValue)) nextResponse[attr] = scValue;

		const scUnit = unitAttr
			? getBlockDefaultValue({
					styleCard,
					blockStyle,
					blockName,
					attr: unitAttr,
			  })
			: undefined;

		if (unitAttr && isValidValue(scUnit)) nextResponse[unitAttr] = scUnit;
		if (!isValidValue(scValue) && !hasDefaultLikeCurrentValue) return;

		const fallback = isValidValue(scValue)
			? getStyleCardFallbackValue({
					blockName,
					attr,
					unitAttr,
					value: scValue,
					attributes,
					defaultAttributes,
					scUnit,
			  })
			: getFallback({
					blockName,
					attr,
					unitAttr,
					defaultAttributes,
			  }) ||
			  getFallbackValue({
					blockName,
					attr,
					unitAttr,
					currentValue,
					value,
					attributes,
					defaultAttributes,
					scUnit,
			  });

		nextResponse[SC_BLOCK_DEFAULTS_META_KEY] = {
			...nextResponse[SC_BLOCK_DEFAULTS_META_KEY],
			[attr]: {
				blockName,
				blockStyle,
				cssVar: getBlockDefaultCssVarName(blockStyle, blockName, attr),
				fallback,
			},
		};

		debugSCBlockDefaults('apply value', {
			blockName,
			blockStyle,
			attr,
			unitAttr,
			scValue,
			value,
			scUnit,
			fallback,
			cssVar: nextResponse[SC_BLOCK_DEFAULTS_META_KEY][attr].cssVar,
		});
	});

	debugSCBlockDefaults('apply result', {
		blockName,
		blockStyle,
		response,
		nextResponse,
	});

	return nextResponse;
};

export const getSCBlockDefaultStyleValue = ({
	scBlockDefaults = {},
	prefix = '',
	target,
	breakpoint,
	fallbackValue,
}) => {
	const meta = scBlockDefaults[`${prefix}${target}-${breakpoint}`];
	const availableMetaBlocks = Array.from(
		new Set(
			Object.values(scBlockDefaults)
				.map(value => value?.blockName)
				.filter(Boolean)
		)
	);

	if (!meta?.cssVar) {
		debugSCBlockDefaults('style fallback', {
			target,
			breakpoint,
			fallbackValue,
			prefix,
			meta,
			availableMetaBlocks,
			availableMetaKeys: Object.keys(scBlockDefaults),
		});

		return fallbackValue;
	}

	const value = `var(${meta.cssVar}, ${meta.fallback || fallbackValue})`;

	debugSCBlockDefaults('style css var', {
		target,
		breakpoint,
		fallbackValue,
		prefix,
		meta,
		value,
	});

	return value;
};

export const getStyleCardBlockDefaultVariables = styleCard => {
	const response = {};

	styles.forEach(blockStyle => {
		const blockDefaults = {
			...(styleCard?.[blockStyle]?.defaultStyleCard?.[
				BLOCK_DEFAULTS_GROUP
			] ?? {}),
			...(styleCard?.[blockStyle]?.styleCard?.[BLOCK_DEFAULTS_GROUP] ??
				{}),
		};

		Object.entries(blockDefaults).forEach(([key, value]) => {
			const parsedKey = parseBlockDefaultKey(key);
			if (!parsedKey || !isValidValue(value)) return;

			const { blockName, attr } = parsedKey;
			if (attr.includes('-unit-')) return;

			const unitAttr = getUnitAttribute(attr);
			const unit = unitAttr
				? blockDefaults[getBlockDefaultKey(blockName, unitAttr)]
				: '';

			response[
				getBlockDefaultCssVarName(blockStyle, blockName, attr)
			] = `${value}${unit ?? ''}`;
		});
	});

	debugSCBlockDefaults('generated variables', response);

	return response;
};
