/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isEmpty, isNil } from 'lodash';
import uniqueIDGenerator from './uniqueIDGenerator';

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/map-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/number-counter-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/video-maxi',
];

/**
 * Add custom Maxi Blocks attributes to selected blocks
 *
 * @param {Function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withAttributes = createHigherOrderComponent(
	BlockEdit => props => {
		const { attributes, name: blockName, clientId } = props;
		const { uniqueID } = attributes;

		if (allowedBlocks.includes(blockName)) {
			// uniqueID
			if (
				isNil(uniqueID) ||
				document.getElementsByClassName(uniqueID).length > 1
			) {
				attributes.uniqueID = uniqueIDGenerator(blockName);

				const label = attributes.uniqueID.replace('-maxi-', '_');
				attributes.customLabel =
					label.charAt(0).toUpperCase() + label.slice(1);
			}
			// isFirstOnHierarchy
			const parentBlocks = select('core/block-editor')
				.getBlockParents(clientId)
				.filter(el => {
					return el !== clientId;
				});

			if (parentBlocks.includes(clientId)) parentBlocks.pop();

			attributes.isFirstOnHierarchy = isEmpty(parentBlocks);
			if (!attributes.isFirstOnHierarchy) {
				const { getBlockHierarchyRootClientId } =
					select('core/block-editor');

				const firstParentBlock = select('core/block-editor').getBlock(
					getBlockHierarchyRootClientId(clientId)
				);

				attributes.blockStyle = firstParentBlock.attributes.blockStyle;
			}

			// RTL
			if (
				'text-alignment-general' in attributes &&
				!attributes['text-alignment-general']
			) {
				const { isRTL } = select('core/editor').getEditorSettings();

				attributes['text-alignment-general'] = isRTL ? 'right' : 'left';
			}
		}

		return <BlockEdit {...props} />;
	},
	'withAttributes'
);

addFilter('editor.BlockEdit', 'maxi-blocks/attributes', withAttributes);
