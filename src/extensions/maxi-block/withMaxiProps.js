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
import { excludeAttributes } from '../copy-paste';
import { getBlockData, getUpdatedSVGDataAndElement } from '../attributes';
import BlockInserter from '../../components/block-inserter';
import { handleBlockMove, updateRelationsInColumn } from '../repeater';
import {
	findBlockPosition,
	findTargetParent,
	getBlockPosition,
} from '../repeater/utils';
import RepeaterContext from '../../blocks/row-maxi/repeaterContext';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes, name, clientId, isSelected } =
				ownProps;

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

			const parentColumnClientId =
				repeaterContext?.repeaterStatus &&
				getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/column-maxi'
				)[0];

			const {
				deviceType,
				baseBreakpoint,
				hasSelectedChild,
				isTyping,
				blockIndex,
				blockRootClientId,
			} = useSelect(select => {
				const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
					select('maxiBlocks');
				const {
					hasSelectedInnerBlock,
					isTyping,
					getBlockIndex,
					getBlockRootClientId,
				} = select('core/block-editor');

				return {
					deviceType: receiveMaxiDeviceType(),
					baseBreakpoint: receiveBaseBreakpoint(),
					hasSelectedChild: hasSelectedInnerBlock(clientId, true),
					isTyping: isTyping(),
					blockIndex: getBlockIndex(clientId),
					blockRootClientId: getBlockRootClientId(clientId),
				};
			});

			const blockPositionFromColumn = useMemo(() => {
				if (parentColumnClientId) {
					return findBlockPosition(
						clientId,
						getBlock(parentColumnClientId)
					);
				}

				return null;
			}, [blockIndex, blockRootClientId, parentColumnClientId]);

			const parentInnerBlocksCount = useMemo(() => {
				const targetParent = findTargetParent(
					blockPositionFromColumn,
					getBlock(parentColumnClientId)
				);

				if (targetParent) {
					return targetParent.innerBlocks.length;
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
								const currentAttributes =
									currentBlock?.attributes;

								const nonExcludedAttributes = excludeAttributes(
									obj,
									currentAttributes,
									copyPasteMapping,
									true,
									currentBlock.name
								);

								updateRelationsInColumn(
									nonExcludedAttributes,
									clientId,
									currentClientId,
									innerBlocksPositions
								);

								if (
									'SVGData' in nonExcludedAttributes &&
									'SVGElement' in nonExcludedAttributes
								) {
									const { SVGData, SVGElement } =
										getUpdatedSVGDataAndElement(
											nonExcludedAttributes,
											currentAttributes.uniqueID,
											'',
											currentAttributes.mediaURL
										);

									nonExcludedAttributes.SVGData = SVGData;
									nonExcludedAttributes.SVGElement =
										SVGElement;
								}

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
						parentInnerBlocksCount={parentInnerBlocksCount}
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
					{/*
						Need to check if it's typing to avoid an error on Text Maxi when moving the caret selector doing a keyDown event.
						It happens when, for example, you are typing and you move the caret selector to another block using the arrows.
					*/}
					{!isTyping && (
						<BlockInserter.InterBlockInserter
							ref={ref}
							{...ownProps}
						/>
					)}
				</>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
