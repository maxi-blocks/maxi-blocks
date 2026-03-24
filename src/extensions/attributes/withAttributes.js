/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { dispatch, select, useDispatch, useSelect } from '@wordpress/data';
import {
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import uniqueIDGenerator from './uniqueIDGenerator';
import { insertBlockIntoColumns } from '@extensions/repeater';
import { getCustomLabel } from '@extensions/maxi-block';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

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
		const { attributes, name: blockName, clientId, setAttributes } = props;

		const wasUniqueIDAdded = useRef(false);

		const repeaterContext = useContext(RepeaterContext);
		const repeaterStatus = repeaterContext?.repeaterStatus;

		const blockRootClientId = useSelect(select => {
			if (allowedBlocks.includes(blockName)) {
				return select('core/block-editor').getBlockRootClientId(
					clientId
				);
			}
			return null;
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = useDispatch('core/block-editor', []);

		// Never mutate `attributes` during render — it desyncs core/block-editor state from
		// what child components saw; the next list reconciliation passes a fresh object and
		// MaxiBlockComponent SCU reports real `attributes` diffs (same log for any inserter).

		useLayoutEffect(() => {
			if (!allowedBlocks.includes(blockName)) {
				return;
			}
			const fromStore = select('core/block-editor').getBlock(clientId)
				?.attributes?.uniqueID;
			if (!isNil(fromStore) || !isNil(attributes.uniqueID)) {
				return;
			}
			const newUniqueID = uniqueIDGenerator({ blockName, clientId });
			markNextChangeAsNotPersistent();
			setAttributes({
				uniqueID: newUniqueID,
				customLabel: getCustomLabel(
					attributes.customLabel,
					newUniqueID
				),
			});
			dispatch('maxiBlocks/blocks').addNewBlock(newUniqueID);
			wasUniqueIDAdded.current = true;
		}, [
			blockName,
			clientId,
			attributes.uniqueID,
			attributes.customLabel,
			setAttributes,
			markNextChangeAsNotPersistent,
		]);

		useLayoutEffect(() => {
			if (!allowedBlocks.includes(blockName)) {
				return;
			}
			if (
				!('text-alignment-general' in attributes) ||
				attributes['text-alignment-general']
			) {
				return;
			}
			const { isRTL } = select('core/editor').getEditorSettings();
			markNextChangeAsNotPersistent();
			setAttributes({
				'text-alignment-general': isRTL ? 'right' : 'left',
			});
		}, [
			blockName,
			attributes['text-alignment-general'],
			setAttributes,
			markNextChangeAsNotPersistent,
		]);

		useEffect(() => {
			if (repeaterStatus) {
				repeaterContext?.updateInnerBlocksPositions();
			}
		}, []);

		useEffect(() => {
			if (
				!repeaterContext?.repeaterStatus ||
				!wasUniqueIDAdded.current ||
				isNil(attributes.uniqueID)
			) {
				return;
			}
			insertBlockIntoColumns(
				clientId,
				repeaterContext?.getInnerBlocksPositions?.()?.[[-1]]
			);
			wasUniqueIDAdded.current = false;
		}, [
			attributes.uniqueID,
			clientId,
			repeaterContext?.repeaterStatus,
			repeaterContext?.getInnerBlocksPositions,
		]);

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
			if (!allowedBlocks.includes(blockName)) {
				return;
			}

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

			if (isFirstOnHierarchyUpdated) {
				return;
			}

			const stored = attributes.isFirstOnHierarchy;
			// Avoid setAttributes when nested row already behaves as false but attr was never
			// persisted (undefined). Main inserter reconciliation can re-parse and drop optional
			// keys, toggling undefined vs false and re-running this effect — real attributes
			// churn + MaxiBlockComponent SCU noise on sibling rows.
			const missingMeansFalse =
				!isFirstOnHierarchy &&
				(stored === undefined || stored === null);

			if (missingMeansFalse) {
				return;
			}

			if (isFirstOnHierarchy !== stored) {
				markNextChangeAsNotPersistent();
				setAttributes({
					isFirstOnHierarchy,
				});
				attributes.isFirstOnHierarchy = isFirstOnHierarchy;
			}
		}, [blockRootClientId, attributes.isFirstOnHierarchy]);

		return <BlockEdit {...props} />;
	},
	'withAttributes'
);

addFilter('editor.BlockEdit', 'maxi-blocks/attributes', withAttributes);
