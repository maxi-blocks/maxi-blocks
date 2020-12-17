/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { select } = wp.data;

/**
 * External Dependencies
 */
import { uniqueId, isEmpty, isNil, isNumber } from 'lodash';

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/block-image-box',
	'maxi-blocks/block-title-extra',
	'maxi-blocks/testimonials-slider-block',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/section-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/icon-maxi',
	'maxi-blocks/font-icon-maxi',
];

/**
 * Filters registered block settings, extending attributes with settings
 *
 * @param {Object} settings Original block settings.
 * @return {Object} Filtered block settings.
 */
const addAttributes = settings => {
	// Add custom selector/id
	if (allowedBlocks.includes(settings.name) && !isNil(settings.attributes)) {
		settings.attributes = Object.assign(settings.attributes, {
			blockStyle: {
				type: 'string',
				default: null,
			},
			defaultBlockStyle: {
				type: 'string',
				default: 'maxi-def-light',
			},
			isHighlightText: {
				type: 'number',
				default: 0,
			},
			isHighlightBackground: {
				type: 'number',
				default: 0,
			},
			isHighlightBorder: {
				type: 'number',
				default: 0,
			},
			isHighlightColor1: {
				type: 'number',
				default: 0,
			},
			isHighlightColor2: {
				type: 'number',
				default: 0,
			},
			blockStyleBackground: {
				type: 'number',
				default: 1,
			},
			uniqueID: {
				type: 'string',
			},
			isFirstOnHierarchy: {
				type: 'boolean',
			},
			linkSettings: {
				type: 'string',
				default: '{}',
			},
			extraClassName: {
				type: 'string',
				default: '',
			},
			zIndex: {
				type: 'string',
				default:
					'{"label":"ZIndex","general":{"z-index":""},"xxl":{"z-index":""},"xl":{"z-index":""},"l":{"z-index":""},"m":{"z-index":""},"s":{"z-index":""},"xs":{"z-index":""}}',
			},
			breakpoints: {
				type: 'string',
				default:
					'{"label":"Breakpoints","general":"","xl":"","l":"","m":"","s":"","xs":""}',
			},
		});
	}

	if (allowedBlocks.includes(settings.name) && !isNil(settings.support)) {
		settings.support = Object.assign(settings.support, {
			customClassName: false,
		});
	}

	return settings;
};

const uniqueIdCreator = name => {
	const newID = uniqueId(`${name.replace('maxi-blocks/', '')}-`);

	if (
		!isEmpty(document.getElementsByClassName(newID)) ||
		!isNil(document.getElementById(newID))
	)
		uniqueIdCreator(name);

	return newID;
};

/**
 * Add custom Maxi Blocks attributes to selected blocks
 *
 * @param {Function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withAttributes = createHigherOrderComponent(
	BlockEdit => props => {
		const {
			attributes: { uniqueID, breakpoints },
			name,
			clientId,
		} = props;

		if (allowedBlocks.includes(name)) {
			// uniqueID
			if (
				isNil(uniqueID) ||
				document.getElementsByClassName(uniqueID).length > 1
			)
				props.attributes.uniqueID = uniqueIdCreator(name);

			// isFirstOnHierarchy
			const parentBlocks = select('core/block-editor')
				.getBlockParents(clientId)
				.filter(el => {
					return el !== clientId;
				});

			if (parentBlocks.includes(clientId)) parentBlocks.pop();

			props.attributes.isFirstOnHierarchy = isEmpty(parentBlocks);

			// Breakpoints
			const defaultBreakpoints = select(
				'maxiBlocks'
			).receiveMaxiBreakpoints();
			const value = JSON.parse(breakpoints);

			if (!isNumber(value.xl) && !isEmpty(defaultBreakpoints)) {
				const response = {
					xl: defaultBreakpoints.xl,
					l: defaultBreakpoints.l,
					m: defaultBreakpoints.m,
					s: defaultBreakpoints.s,
					xs: defaultBreakpoints.xs,
				};

				props.attributes.breakpoints = JSON.stringify(response);
			}
		}

		return <BlockEdit {...props} />;
	},
	'withAttributes'
);

addFilter(
	'blocks.registerBlockType',
	'maxi-blocks/custom/attributes',
	addAttributes
);

addFilter('editor.BlockEdit', 'maxi-blocks/attributes', withAttributes);
