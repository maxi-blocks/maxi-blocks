/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select } from '@wordpress/data';
import { useContext, useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import uniqueIDGenerator from './uniqueIDGenerator';
import { insertBlockIntoColumns } from '../repeater';
import { getCustomLabel } from '../maxi-block';
import RepeaterContext from '../../blocks/row-maxi/repeaterContext';

/**
 * External Dependencies
 */
import { isEmpty, isNil } from 'lodash';

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
		const { uniqueID } = attributes;

		const wasUniqueIDAdded = useRef(false);

		const repeaterContext = useContext(RepeaterContext);
		const repeaterStatus = repeaterContext?.repeaterStatus;

		if (allowedBlocks.includes(blockName)) {
			// uniqueID
			if (isNil(uniqueID)) {
				const newUniqueID = uniqueIDGenerator({ blockName, clientId });

				attributes.uniqueID = newUniqueID;
				attributes.customLabel = getCustomLabel(
					attributes.customLabel,
					newUniqueID
				);

				wasUniqueIDAdded.current = true;
			}
			// isFirstOnHierarchy
			const parentBlocks = select('core/block-editor')
				.getBlockParentsByBlockName(clientId, allowedBlocks)
				.filter(el => {
					return el !== clientId;
				});

			if (parentBlocks.includes(clientId)) parentBlocks.pop();

			attributes.isFirstOnHierarchy = isEmpty(parentBlocks);
			if (!attributes.isFirstOnHierarchy) {
				const firstMaxiParentBlock = select(
					'core/block-editor'
				).getBlock(parentBlocks[0]);

				attributes.blockStyle =
					firstMaxiParentBlock.attributes.blockStyle;
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

		useEffect(() => {
			if (repeaterStatus) {
				repeaterContext?.updateInnerBlocksPositions();
			}
		}, []);

		useEffect(() => {
			if (repeaterContext?.repeaterStatus && wasUniqueIDAdded.current) {
				insertBlockIntoColumns(
					clientId,
					repeaterContext?.getInnerBlocksPositions?.()?.[[-1]]
				);
			}
		}, [wasUniqueIDAdded.current]);

		return <BlockEdit {...props} />;
	},
	'withAttributes'
);

addFilter('editor.BlockEdit', 'maxi-blocks/attributes', withAttributes);
