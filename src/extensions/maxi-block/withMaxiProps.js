/**
 * WordPress dependencies
 */
import { dispatch, useDispatch, useSelect } from '@wordpress/data';
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
import { findBlockPosition, getBlockPosition } from '@extensions/repeater/utils';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const DISABLED_BLOCKS = ['maxi-blocks/list-item-maxi'];

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			if (!ownProps) {
				return null;
			}
			const {
				setAttributes,
				attributes,
				name,
				clientId,
				isSelected,
				contextLoopContext,
			} = ownProps;

			const repeaterContext = useContext(RepeaterContext);

			const {
				getBlock,
				getBlockOrder,
				getBlockParents,
				getBlockParentsByBlockName,
			} = useSelect(select => select('core/block-editor'), []);

			const {
				updateBlockAttributes,
				__unstableMarkNextChangeAsNotPersistent:
					markNextChangeAsNotPersistent,
			} = useDispatch('core/block-editor');

			const copyPasteMapping = getBlockData(name)?.copyPasteMapping;

			const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

			const {
				deviceType,
				baseBreakpoint,
				hasSelectedChild,
				isTyping,
				blockIndex,
				blockRootClientId,
				// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
				// isLastBlock,
			} = useSelect(select => {
				const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
					select('maxiBlocks');
				const {
					hasSelectedInnerBlock,
					isTyping,
					getBlockIndex,
					getBlockRootClientId,
					// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
					// getBlocks,
				} = select('core/block-editor');

				const currentBlockIndex = getBlockIndex(clientId);
				// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
				// const allBlocks = getBlocks();

				return {
					deviceType: receiveMaxiDeviceType(),
					baseBreakpoint: receiveBaseBreakpoint(),
					hasSelectedChild: hasSelectedInnerBlock(clientId, true),
					isTyping: isTyping(),
					blockIndex: currentBlockIndex,
					blockRootClientId: getBlockRootClientId(clientId),
					// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
					// isLastBlock:
					// 	attributes?.isFirstOnHierarchy &&
					// 	currentBlockIndex === allBlocks.length - 1,
				};
			});

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

			const maxiSetAttributes = useCallback(obj =>
				handleSetAttributes({
					obj,
					attributes,
					clientId,
					onChange: obj => {
						if (!repeaterContext?.repeaterStatus) {
							return setAttributes(obj);
						}

						const innerBlocksPositions =
							repeaterContext?.getInnerBlocksPositions();

						const clientIds =
							innerBlocksPositions?.[
								getBlockPosition(clientId, innerBlocksPositions)
							];

						if (clientIds) {
							clientIds.forEach(currentClientId => {
								if (currentClientId === clientId) return;

								const currentBlock = getBlock(currentClientId);
								if (!currentBlock) return;
								const currentAttributes =
									currentBlock?.attributes;

								const nonExcludedAttributes = excludeAttributes(
									obj,
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

						return setAttributes(obj);
					},
				})
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

			useEffect(() => {
				dispatch('maxiBlocks/styles').savePrevSavedAttrs([]);
			}, [isSelected]);

			useEffect(() => {
				if (repeaterContext?.repeaterStatus) {
					const innerBlocksPositions =
						repeaterContext?.getInnerBlocksPositions();

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
				}
			}, [blockPositionFromColumn]);

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
