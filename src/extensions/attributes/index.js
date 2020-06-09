/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { select } = wp.data;

/**
 * External Dependencies
 */
import {
	uniqueId,
	isEmpty,
	isNil,
} from 'lodash';

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
];

/**
 * Filters registered block settings, extending attributes with settings
 *
 * @param {Object} settings Original block settings.
 * @return {Object} Filtered block settings.
 */
function addAttributes(settings) {
	// Add custom selector/id
	if (allowedBlocks.includes(settings.name) && !isNil(settings.attributes)) {
		settings.attributes = Object.assign(settings.attributes, {
			uniqueID: {
				type: 'string',
			},
			isFirstOnHierarchy: {
				type: 'boolean',
				default: false
			},
			linkSettings: {
				type: 'string',
				default: '{}'
			}
		});
	}

	if (allowedBlocks.includes(settings.name) && !isNil(settings.support)) {
		settings.support = Object.assign(settings.support, {
			customClassName: false
		})
	}

	return settings;
}

/**
 * Add custom Maxi Blocks attributes to selected blocks
 *
 * @param {function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withAttributes = createHigherOrderComponent(
	BlockEdit => props => {
		const {
			attributes: {
				uniqueID,
			},
			name,
			clientId
		} = props;

		if (allowedBlocks.includes(name)) {
			// uniqueID
			if (isNil(uniqueID) || document.getElementsByClassName(uniqueID).length > 1)
				props.attributes.uniqueID = uniqueIdCreator(name);

			// isFirstOnHierarchy
			const hasParentBlocks = !isEmpty(select('core/block-editor').getBlockParents(clientId));

			if (!hasParentBlocks)
				props.attributes.isFirstOnHierarchy = true;
			else
				props.attributes.isFirstOnHierarchy = false;
		}

		return <BlockEdit {...props} />;
	},
	'withAttributes'
);

const uniqueIdCreator = name => {
	let newID = uniqueId(`${name.replace('maxi-blocks/', '')}-`);

	if (!isEmpty(document.getElementsByClassName(newID)) || !isNil(document.getElementById(newID)))
		uniqueIdCreator(name);

	return newID;
}

addFilter(
	'blocks.registerBlockType',
	'maxi-blocks/custom/attributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'maxi-blocks/attributes',
	withAttributes
);