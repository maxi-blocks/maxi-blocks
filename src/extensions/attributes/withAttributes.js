/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import uniqueIDGenerator from './uniqueIDGenerator';
import { getCustomLabel } from '../maxi-block';
import getAttributeKey from './getAttributeKey';
import getAttributesValue from './getAttributesValue';

/**
 * External Dependencies
 */
import { isEmpty, isNil } from 'lodash';

/**
 * g
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
	'maxi-blocks/slide-maxi',
	'maxi-blocks/slider-maxi',
	'maxi-blocks/pane-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/video-maxi',
	'maxi-blocks/search-maxi',
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
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: attributes,
		});

		if (allowedBlocks.includes(blockName)) {
			// uniqueID
			if (isNil(uniqueID)) {
				const newUniqueID = uniqueIDGenerator({ blockName, clientId });

				attributes._uid = newUniqueID;
				attributes._cl = getCustomLabel(attributes._cl, newUniqueID);
			}
			// isFirstOnHierarchy
			const parentBlocks = select('core/block-editor')
				.getBlockParentsByBlockName(clientId, allowedBlocks)
				.filter(el => {
					return el !== clientId;
				});

			if (parentBlocks.includes(clientId)) parentBlocks.pop();

			attributes._ioh = isEmpty(parentBlocks);
			if (!attributes._ioh) {
				const firstMaxiParentBlock = select(
					'core/block-editor'
				).getBlock(parentBlocks[0]);

				attributes._bs = firstMaxiParentBlock.attributes._bs;
			}

			// RTL
			const textAlignmentLabel = getAttributeKey({
				key: '_ta',
				breakpoint: 'g',
			});

			if (
				textAlignmentLabel in attributes &&
				!attributes[textAlignmentLabel]
			) {
				const { isRTL } = select('core/editor').getEditorSettings();

				attributes[textAlignmentLabel] = isRTL ? 'right' : 'left';
			}
		}

		return <BlockEdit {...props} />;
	},
	'withAttributes'
);

addFilter('editor.BlockEdit', 'maxi-blocks/attributes', withAttributes);
