import { select } from '@wordpress/data';

import getActiveStyleCard from './getActiveStyleCard';

export const BLOCK_DEFAULTS_GROUP = 'blockDefaults';
const BLOCK_DEFAULT_KEY_SEPARATOR = '|';
const SC_BLOCK_DEFAULTS_META_KEY = '__scBlockDefaults';

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

const getActiveStyleCardValue = () => {
	let store = null;

	try {
		store = select('maxiBlocks/style-cards');
	} catch {
		return null;
	}

	const styleCards = store?.receiveMaxiStyleCards?.();

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

	if (
		isValidValue(currentValue) &&
		isValidValue(shippedValue) &&
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

	if (!blockName || !blockStyle) return response;

	const styleCard = rawStyleCard || getActiveStyleCardValue();
	if (!styleCard) return response;

	const blockDefaults = getBlockDefaults(styleCard, blockStyle);

	const nextResponse = { ...response };

	Object.keys(defaultAttributes).forEach(attr => {
		if (attr.includes('-unit-')) return;
		if (shouldRespectSizeToggle(attr, attributes)) return;

		const unitAttr = getUnitAttribute(attr);
		const attributeChanged = isAttributeChanged({
			attr,
			unitAttr,
			blockName,
			attributes,
			defaultAttributes,
		});

		if (attributeChanged) return;

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

		const fallback =
			getFallback({
				blockName,
				attr,
				unitAttr,
				defaultAttributes,
			}) || `${value}${unitAttr ? attributes?.[unitAttr] ?? '' : ''}`;

		nextResponse[SC_BLOCK_DEFAULTS_META_KEY] = {
			...nextResponse[SC_BLOCK_DEFAULTS_META_KEY],
			[attr]: {
				blockName,
				blockStyle,
				cssVar: getBlockDefaultCssVarName(blockStyle, blockName, attr),
				fallback,
			},
		};
	});

	return nextResponse;
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

	return response;
};
