/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { dispatch, select, useDispatch, useSelect } from '@wordpress/data';
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
import { isNil } from 'lodash';

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/list-item-maxi',
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
 * Add custom MaxiBlocks attributes to selected blocks
 *
 * @param {Function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withAttributes = createHigherOrderComponent(
	BlockEdit => props => {
		if (!props) {
			return null;
		}
		console.time(`withAttributes ${props.attributes.uniqueID}`);
		const { attributes, name: blockName, clientId, setAttributes } = props;
		const { uniqueID } = attributes;

		const wasUniqueIDAdded = useRef(false);

		const repeaterContext = useContext(RepeaterContext);
		const repeaterStatus = repeaterContext?.repeaterStatus;

		const getBlockRootClientId = (select, blockName, clientId) => {
			if (allowedBlocks.includes(blockName)) {
				return select('core/block-editor').getBlockRootClientId(
					clientId
				);
			}
			return null;
		};

		const blockRootClientId = useSelect(
			select => getBlockRootClientId(select, blockName, clientId),
			[blockName, clientId]
		);

		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = useDispatch('core/block-editor', []);

		if (allowedBlocks.includes(blockName)) {
			// uniqueID
			if (isNil(uniqueID)) {
				const newUniqueID = uniqueIDGenerator({ blockName, clientId });

				attributes.uniqueID = newUniqueID;
				attributes.customLabel = getCustomLabel(
					attributes.customLabel,
					newUniqueID
				);

				dispatch('maxiBlocks/blocks').addNewBlock(newUniqueID);

				wasUniqueIDAdded.current = true;
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
		}, [repeaterStatus, repeaterContext]);

		useEffect(() => {
			if (repeaterContext?.repeaterStatus && wasUniqueIDAdded.current) {
				insertBlockIntoColumns(
					clientId,
					repeaterContext?.getInnerBlocksPositions?.()?.[[-1]]
				);
			}
		}, [clientId, repeaterContext, wasUniqueIDAdded.current]);

		const checkParentBlocks = clientId => {
			const block = select('core/block-editor').getBlock(clientId);
			if (block) {
				if (block.name.startsWith('core')) {
					const parentClientId = select(
						'core/block-editor'
					).getBlockRootClientId(block.clientId);
					if (parentClientId) {
						return checkParentBlocks(parentClientId);
					}
					return true;
				}
			}
			return false;
		};

		useEffect(() => {
			if (allowedBlocks.includes(blockName)) {
				const isFirstOnHierarchy = !blockRootClientId;
				let isFirstOnHierarchyUpdated = false;
				const currentClientId = blockRootClientId;

				if (!isFirstOnHierarchy) {
					const isReusableFirstOnHierarchy =
						checkParentBlocks(currentClientId);

					if (isReusableFirstOnHierarchy) {
						isFirstOnHierarchyUpdated = true;
						markNextChangeAsNotPersistent();
						setAttributes({
							isFirstOnHierarchy: isReusableFirstOnHierarchy,
						});
					}
				}

				if (
					!isFirstOnHierarchyUpdated &&
					isFirstOnHierarchy !== attributes.isFirstOnHierarchy
				) {
					markNextChangeAsNotPersistent();
					setAttributes({
						isFirstOnHierarchy,
					});
				}
			}
		}, [
			blockRootClientId,
			allowedBlocks,
			blockName,
			attributes.isFirstOnHierarchy,
			markNextChangeAsNotPersistent,
			setAttributes,
		]);

		console.timeEnd(`withAttributes ${props.attributes.uniqueID}`);

		return <BlockEdit {...props} />;
	},
	'withAttributes'
);

addFilter('editor.BlockEdit', 'maxi-blocks/attributes', withAttributes);
