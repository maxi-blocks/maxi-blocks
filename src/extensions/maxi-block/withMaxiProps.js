/**
 * WordPress dependencies
 */
import { dispatch, select, useDispatch, useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import handleSetAttributes from './handleSetAttributes';
import {
	handleInsertInlineStyles,
	handleCleanInlineStyles,
} from './inlineStyles';
import { excludeAttributes } from '@extensions/copy-paste';
import { getBlockData } from '@extensions/attributes';
import BlockInserter from '@components/block-inserter';
import {
	handleBlockMove,
	updateNCLimits,
	updateRelationsInColumn,
	updateSVG,
} from '@extensions/repeater';
import {
	findBlockPosition,
	getBlockPosition,
} from '@extensions/repeater/utils';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const DISABLED_BLOCKS = ['maxi-blocks/list-item-maxi'];

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			if (!ownProps) return null;
			const {
				setAttributes,
				attributes,
				name,
				clientId,
				isSelected,
				contextLoopContext,
			} = ownProps;

			const repeaterContext = useContext(RepeaterContext);

			// Memoize selectors to prevent recreation on every render
			const blockEditorSelectors = useMemo(() => {
				const selectStore = select('core/block-editor');
				return {
					getBlock: selectStore.getBlock,
					getBlockOrder: selectStore.getBlockOrder,
					getBlockParents: selectStore.getBlockParents,
					getBlockParentsByBlockName:
						selectStore.getBlockParentsByBlockName,
				};
			}, []);

			const {
				getBlock,
				getBlockOrder,
				getBlockParents,
				getBlockParentsByBlockName,
			} = blockEditorSelectors;

			const {
				updateBlockAttributes,
				__unstableMarkNextChangeAsNotPersistent:
					markNextChangeAsNotPersistent,
			} = useDispatch('core/block-editor');

			const copyPasteMapping = getBlockData(name)?.copyPasteMapping;

			const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

			const deviceType = useSelect(select => {
				return select('maxiBlocks').receiveMaxiDeviceType();
			}, []);

			const baseBreakpoint = useSelect(select => {
				return select('maxiBlocks').receiveBaseBreakpoint();
			}, []);

			const hasSelectedChild = useSelect(
				select => {
					return select('core/block-editor').hasSelectedInnerBlock(
						clientId,
						true
					);
				},
				[clientId]
			);

			const isTyping = useSelect(select => {
				return select('core/block-editor').isTyping();
			}, []);

			const blockIndex = useSelect(
				select => {
					return select('core/block-editor').getBlockIndex(clientId);
				},
				[clientId]
			);

			// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
			// const isLastBlock = useSelect( select => {
			//     const { getBlocks, getBlockIndex } = select('core/block-editor');
			//     const allBlocks = getBlocks();
			//     const currentBlockIndex = getBlockIndex(clientId);
			//     return attributes?.isFirstOnHierarchy && currentBlockIndex === allBlocks.length - 1;
			// }, [clientId, attributes?.isFirstOnHierarchy]);

			const blockRootClientId = useSelect(
				select => {
					return select('core/block-editor').getBlockRootClientId(
						clientId
					);
				},
				[clientId]
			);

			const parentColumnClientId = useMemo(() => {
				if (repeaterContext?.repeaterStatus) {
					const innerBlockPositions =
						repeaterContext?.getInnerBlocksPositions();

					if (innerBlockPositions?.[[-1]]?.includes(clientId)) {
						return clientId;
					}

					return getBlockParentsByBlockName(
						clientId,
						'maxi-blocks/column-maxi'
					).find(parentClientId =>
						innerBlockPositions?.[[-1]]?.includes(parentClientId)
					);
				}

				return null;
			}, [
				clientId,
				blockRootClientId,
				repeaterContext?.repeaterStatus,
				repeaterContext?.getInnerBlocksPositions,
			]);

			const blockPositionFromColumn = useMemo(() => {
				if (parentColumnClientId) {
					return findBlockPosition(
						clientId,
						getBlock(parentColumnClientId)
					);
				}

				return null;
			}, [blockIndex, blockRootClientId, parentColumnClientId]);

			const maxiSetAttributes = useCallback(
				obj => {
					// First, check if we already have a blockStyle that needs to be preserved
					const originalBlockStyle = attributes.blockStyle;

					return handleSetAttributes({
						obj,
						attributes,
						clientId,
						onChange: newAttributes => {
							// Ensure that blockStyle is preserved in all cases where it's not explicitly changed
							if (
								originalBlockStyle &&
								!('blockStyle' in newAttributes) &&
								!('blockStyle' in obj)
							) {
								// Preserve the original blockStyle if it's not being explicitly changed
								newAttributes.blockStyle = originalBlockStyle;
							}

							if (!repeaterContext?.repeaterStatus) {
								return setAttributes(newAttributes);
							}

							const innerBlocksPositions =
								repeaterContext?.getInnerBlocksPositions();

							const clientIds =
								innerBlocksPositions?.[
									getBlockPosition(
										clientId,
										innerBlocksPositions
									)
								];

							if (clientIds) {
								clientIds.forEach(currentClientId => {
									if (currentClientId === clientId) return;

									const currentBlock =
										getBlock(currentClientId);
									if (!currentBlock) return;
									const currentAttributes =
										currentBlock?.attributes;

									const nonExcludedAttributes =
										excludeAttributes(
											newAttributes,
											currentAttributes,
											copyPasteMapping,
											true,
											currentBlock.name,
											contextLoopContext?.contextLoop?.[
												'cl-status'
											] && ['dc-id']
										);

									updateNCLimits(
										nonExcludedAttributes,
										currentAttributes
									);

									updateSVG(
										nonExcludedAttributes,
										currentAttributes
									);

									const columnClientId =
										innerBlocksPositions?.[[-1]]?.[
											innerBlocksPositions?.[
												blockPositionFromColumn
											]?.indexOf(clientId)
										];

									const currentPosition = getBlockPosition(
										currentClientId,
										innerBlocksPositions
									);
									const currentColumnClientId =
										innerBlocksPositions?.[[-1]]?.[
											innerBlocksPositions?.[
												currentPosition
											]?.indexOf(currentClientId)
										];

									updateRelationsInColumn(
										nonExcludedAttributes,
										columnClientId,
										currentColumnClientId,
										innerBlocksPositions
									);

									if (!isEmpty(nonExcludedAttributes)) {
										updateBlockAttributes(
											currentClientId,
											nonExcludedAttributes
										);
										markNextChangeAsNotPersistent();
									}
								});
							}

							return setAttributes(newAttributes);
						},
					});
				},
				[
					attributes,
					clientId,
					setAttributes,
					repeaterContext,
					copyPasteMapping,
					contextLoopContext,
					blockPositionFromColumn,
				]
			);

			const ref = useRef(null);
			const styleObjKeys = useRef([]);

			const insertInlineStyles = useCallback(
				({
					obj,
					target = '',
					isMultiplySelector = false,
					pseudoElement = '',
				}) =>
					handleInsertInlineStyles({
						styleObj: obj,
						target,
						isMultiplySelector,
						pseudoElement,
						styleObjKeys,
						ref,
					}),
				[styleObjKeys, ref]
			);

			const cleanInlineStyles = useCallback(
				(target = '', pseudoElement = '') =>
					handleCleanInlineStyles(
						target,
						pseudoElement,
						styleObjKeys,
						ref
					),
				[styleObjKeys, ref]
			);

			const getBounds = useCallback(selector => {
				const blockRef = ref.current.blockRef.current;

				const getTarget = () => {
					if (selector) {
						const target = blockRef.querySelector(selector);
						if (target) return target;
					}
					return blockRef;
				};

				return getTarget().getBoundingClientRect();
			}, []);

			// Clean up effect for selected state changes
			useEffect(() => {
				if (isSelected) {
					dispatch('maxiBlocks/styles').savePrevSavedAttrs([]);
				}
				// No cleanup needed for this effect
			}, [isSelected]);

			// Effect for handling repeater block moves with proper cleanup
			useEffect(() => {
				if (!repeaterContext?.repeaterStatus) {
					return;
				}

				const innerBlocksPositions =
					repeaterContext?.getInnerBlocksPositions();
				if (!innerBlocksPositions) {
					return;
				}

				const blockPositionFromInnerBlocks = getBlockPosition(
					clientId,
					innerBlocksPositions
				);

				if (
					blockPositionFromInnerBlocks &&
					blockPositionFromColumn &&
					!isEqual(
						blockPositionFromInnerBlocks,
						blockPositionFromColumn
					)
				) {
					handleBlockMove(
						clientId,
						blockPositionFromInnerBlocks,
						blockPositionFromColumn,
						innerBlocksPositions
					);

					repeaterContext?.updateInnerBlocksPositions();
				}
			}, [
				blockPositionFromColumn,
				repeaterContext?.repeaterStatus,
				clientId,
			]);

			return (
				<>
					<WrappedComponent
						{...ownProps}
						ref={ref}
						attributes={attributes}
						maxiSetAttributes={maxiSetAttributes}
						insertInlineStyles={insertInlineStyles}
						cleanInlineStyles={cleanInlineStyles}
						getBounds={getBounds}
						deviceType={deviceType}
						baseBreakpoint={baseBreakpoint}
						hasInnerBlocks={hasInnerBlocks}
						parentColumnClientId={parentColumnClientId}
						blockPositionFromColumn={blockPositionFromColumn}
						isChild={
							!isEmpty(
								getBlockParents(clientId).filter(
									val => val !== clientId
								)
							)
						}
						hasSelectedChild={hasSelectedChild}
						repeaterStatus={repeaterContext?.repeaterStatus}
						repeaterRowClientId={
							repeaterContext?.repeaterRowClientId
						}
						getInnerBlocksPositions={
							repeaterContext?.getInnerBlocksPositions
						}
						updateInnerBlocksPositions={
							repeaterContext?.updateInnerBlocksPositions
						}
					/>
					{!isTyping && !DISABLED_BLOCKS.includes(ownProps.name) && (
						<BlockInserter.InterBlockInserter
							ref={ref}
							{...ownProps}
						/>
					)}
					{/* TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806 */}
					{/* {isLastBlock && (
						<BlockInserter className='maxi-block-inserter maxi-block-inserter__last' />
					)} */}
				</>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
