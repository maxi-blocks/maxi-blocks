/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import * as attributes from '../styles/defaults/index';

/**
 * External Dependencies
 */
import { uniqueId, isEmpty, isNil } from 'lodash';

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/section-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/font-icon-maxi',
	'maxi-blocks/test-maxi',
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
		settings.attributes = {
			blockStyle: {
				type: 'string',
			},
			defaultBlockStyle: {
				type: 'string',
				default: 'maxi-def-light',
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
				type: 'object',
			},
			extraClassName: {
				type: 'string',
				default: '',
			},
			...attributes.zIndex,
			...attributes.breakpoints,
			...settings.attributes,
		};
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
			attributes: { uniqueID },
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
