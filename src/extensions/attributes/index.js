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
	'gutenberg-extra/block-image-box',
	'gutenberg-extra/block-title-extra',
	'gutenberg-extra/testimonials-slider-block',
	'gutenberg-extra/block-row-extra',
	'gutenberg-extra/block-column-extra',
	'gutenberg-extra/block-button-extra',
	'gutenberg-extra/block-text-extra',
	'gutenberg-extra/block-divider-extra',
	'gutenberg-extra/block-image-extra',
	'gutenberg-extra/block-section-extra',
];

/**
 * Filters registered block settings, extending attributes with settings
 *
 * @param {Object} settings Original block settings.
 * @return {Object} Filtered block settings.
 */
function addAttributes(settings) {
	// Add custom selector/id
	if (allowedBlocks.includes(settings.name) && typeof settings.attributes !== 'undefined') {
		settings.attributes = Object.assign(settings.attributes, {
			uniqueID: {
				type: 'string',
			},
			isFirstOnHierarchy: {
				type: 'boolean',
				default: false
			}
		});
	}

	return settings;
}

/**
 * Add custom Gutenberg Extra attributes to selected blocks
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
	let newID = uniqueId(`gx-${name.replace('gutenberg-extra/', '')}-`);

	if (!isEmpty(document.getElementsByClassName(newID)) || !isNil(document.getElementById(newID)))
		uniqueIdCreator(name);

	return newID;
}

addFilter(
	'blocks.registerBlockType',
	'gutenberg-extra/custom/attributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'gutenberg-extra/attributes',
	withAttributes
);