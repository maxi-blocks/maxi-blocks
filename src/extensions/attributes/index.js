/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;

/**
 * External Dependencies
 */
import { uniqueId } from 'lodash';

/**
 * General
 */
const allowedBlocks = [ 'gutenberg-extra/block-image-box' ];

/**
 * Filters registered block settings, extending attributes with settings
 *
 * @param {Object} settings Original block settings.
 * @return {Object} Filtered block settings.
 */
function addAttributes( settings ) {
	// Add custom selector/id
	if ( allowedBlocks.includes( settings.name ) && typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			uniqueID: { 
				type: 'string',
			},
			// uniqueData: {
			// 	type: 'object'
			// }
		} );
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
		const { name: blockName } = props;
		
		if ( allowedBlocks.includes( blockName ) ) {
			props.attributes.uniqueID = props.attributes.uniqueID || '';

			if ( props.attributes.uniqueID === '' ) {
				const newID = uniqueId(blockName.replace('gutenberg-extra/','') + '-');
				props.attributes.uniqueID = newID;
			}
		}

		return <BlockEdit { ...props } />;
	},
	'withAttributes'
);

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