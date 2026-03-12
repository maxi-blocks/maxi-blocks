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
	getInlineStylesAndTargetsFromAttributes,
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
	getBlockPosition,
	getBlockColumnClientId,
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

			// Track previous relations to detect unexpected clearing
			const prevRelationsRef = useRef(attributes?.relations);
			// Track if we're in the middle of a setAttributes call
			const isSettingAttributesRef = useRef(false);

			// Memoize selectors to prevent recreation on every render
			const blockEditorSelectors = useMemo(() => {
				const selectStore = select('core/block-editor');
				return {
					getBlock: selectStore.getBlock,
					getBlockOrder: selectStore.getBlockOrder,
					getBlockParents: selectStore.getBlockParents,
				};
			}, []);

			const { getBlock, getBlockOrder, getBlockParents } =
				blockEditorSelectors;

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
				// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
				// isLastBlock,
			} = useSelect(select => {
				const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
					select('maxiBlocks');
				const {
					hasSelectedInnerBlock,
					isTyping,
					// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
					// getBlocks,
				} = select('core/block-editor');
				// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
				// const allBlocks = getBlocks();

				return {
					deviceType: receiveMaxiDeviceType(),
					baseBreakpoint: receiveBaseBreakpoint(),
					hasSelectedChild: hasSelectedInnerBlock(clientId, true),
					isTyping: isTyping(),
					// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
					// isLastBlock:
					// 	attributes?.isFirstOnHierarchy &&
					// 	getBlockIndex(clientId) === allBlocks.length - 1,
				};
			});

			const parentColumnClientId = useMemo(() => {
				if (repeaterContext?.repeaterStatus) {
					const innerBlockPositions =
						repeaterContext?.getInnerBlocksPositions();

					return getBlockColumnClientId(
						clientId,
						innerBlockPositions
					);
				}

				return null;
			}, [clientId, repeaterContext]);

			const blockPositionFromColumn = useMemo(() => {
				if (parentColumnClientId) {
					return getBlockPosition(
						clientId,
						repeaterContext?.getInnerBlocksPositions()
					);
				}

				return null;
			}, [clientId, parentColumnClientId, repeaterContext]);

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

			const maxiSetAttributes = useCallback(
				obj => {
					// Mark that we're setting attributes intentionally
					if ('relations' in obj) {
						isSettingAttributesRef.current = true;
					}

					// First, check if we already have a blockStyle that needs to be preserved
					const originalBlockStyle = attributes.blockStyle;

					return handleSetAttributes({
						obj,
						attributes,
						clientId,
						onChangeInline: (changedAttributes, inlineOptions) => {
							const { attributesToStyles } = getBlockData(name);
							if (!attributesToStyles) return;

							const actions =
								getInlineStylesAndTargetsFromAttributes({
									changedAttributes,
									attributesToStyles,
									inlineOptions,
								});

							if (!actions || !Array.isArray(actions)) return;

							actions.forEach(
								({
									styleObj,
									target = '',
									isMultiplySelector = false,
									pseudoElement = '',
								}) => {
									if (!styleObj) return;
									insertInlineStyles({
										obj: styleObj,
										target,
										isMultiplySelector,
										pseudoElement,
									});
								}
							);
						},
						cleanInlineStyles: changedAttributes => {
							const { attributesToStyles } = getBlockData(name);
							if (!attributesToStyles) return;

							const actions =
								getInlineStylesAndTargetsFromAttributes({
									changedAttributes,
									attributesToStyles,
								});

							if (!actions || !Array.isArray(actions)) return;

							actions.forEach(
								({ target = '', pseudoElement = '' }) => {
									cleanInlineStyles(target, pseudoElement);
								}
							);
						},
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
							const blockPosition = getBlockPosition(
								clientId,
								innerBlocksPositions
							);

							const clientIds = innerBlocksPositions?.[blockPosition];
							const columnClientId = getBlockColumnClientId(
								clientId,
								innerBlocksPositions
							);

							if (clientIds) {
								const pendingRepeaterUpdates = {};
								const pendingRepeaterClientIds = [];

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

									const currentColumnClientId =
										getBlockColumnClientId(
											currentClientId,
											innerBlocksPositions
										);

									updateRelationsInColumn(
										nonExcludedAttributes,
										columnClientId,
										currentColumnClientId,
										innerBlocksPositions
									);

									if (!isEmpty(nonExcludedAttributes)) {
										pendingRepeaterClientIds.push(
											currentClientId
										);
										pendingRepeaterUpdates[
											currentClientId
										] = nonExcludedAttributes;
									}
								});

								if (pendingRepeaterClientIds.length) {
									markNextChangeAsNotPersistent();
									updateBlockAttributes(
										pendingRepeaterClientIds,
										pendingRepeaterUpdates,
										true
									);
								}
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
					name,
					insertInlineStyles,
					cleanInlineStyles,
				]
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

		// CRITICAL FIX: Detect and restore relations if they unexpectedly become empty
		useEffect(() => {
			const currentRelations = attributes?.relations;
			const prevRelations = prevRelationsRef.current;

			// If we're intentionally setting relations (through maxiSetAttributes), don't restore
			if (isSettingAttributesRef.current) {
				isSettingAttributesRef.current = false;
				prevRelationsRef.current = currentRelations;
				return;
			}

			// Check if relations unexpectedly became empty or decreased (without going through setAttributes)
			if (
				prevRelations &&
				Array.isArray(prevRelations) &&
				prevRelations.length > 0 &&
				(!currentRelations ||
					(Array.isArray(currentRelations) &&
						currentRelations.length < prevRelations.length))
			) {
				// Restore the previous relations
				setAttributes({ relations: prevRelations });
			}

			// Update the ref for next render
			if (
				currentRelations &&
				Array.isArray(currentRelations) &&
				currentRelations.length > 0
			) {
				prevRelationsRef.current = currentRelations;
			}
		}, [attributes?.relations, setAttributes, clientId]);

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
