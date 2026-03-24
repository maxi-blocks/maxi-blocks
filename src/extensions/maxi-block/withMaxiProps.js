/**
 * WordPress dependencies
 */
import { dispatch, select, useDispatch, useSelect } from '@wordpress/data';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	memo,
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
	findBlockPosition,
	getBlockPosition,
} from '@extensions/repeater/utils';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const DISABLED_BLOCKS = ['maxi-blocks/list-item-maxi'];

/**
 * Subscribes to `isTyping` separately from withMaxiProps' main block-editor useSelect.
 * Opening the left block inserter moves focus and toggles global `isTyping`, which would
 * otherwise force every wrapped block to re-render even when its blockIndex / inner order
 * did not change (wrapper appender path often avoids that focus flip).
 *
 * @param {Object}   props
 * @param {Object}   props.ownProps - Block edit props spread into InterBlockInserter.
 * @param {import('react').RefObject} props.inserterRef - Shared ref with WrappedComponent.
 */
function MaxiInterBlockInserterIfNotTyping({ ownProps, inserterRef }) {
	const isTyping = useSelect(
		select => select('core/block-editor').isTyping(),
		[]
	);

	if (isTyping || DISABLED_BLOCKS.includes(ownProps.name)) {
		return null;
	}

	return (
		<BlockInserter.InterBlockInserter ref={inserterRef} {...ownProps} />
	);
}

/**
 * @wordpress/compose `pure()` uses shallow compare on BlockEdit props. After a sibling is
 * inserted (often via the main inserter), core can pass a new `attributes` object reference
 * for unchanged blocks; shallow compare fails and every Maxi block wrapped here re-renders.
 * Deep-equality for `attributes` / `context` matches MaxiBlockComponent SCU behaviour.
 *
 * @param {Object} prev - Previous BlockEdit props.
 * @param {Object} next - Next BlockEdit props.
 * @return {boolean} True when props are considered equal (skip re-render).
 */
function areMaxiWithMaxiPropsOwnPropsEqual(prev, next) {
	if (prev === next) {
		return true;
	}
	const keys = new Set([
		...Object.keys(prev || {}),
		...Object.keys(next || {}),
	]);
	for (const key of keys) {
		const a = prev[key];
		const b = next[key];
		if (key === 'attributes' || key === 'context') {
			if (!isEqual(a, b)) {
				return false;
			}
			continue;
		}
		if (!Object.is(a, b)) {
			return false;
		}
	}
	return true;
}

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		memo(ownProps => {
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
					getBlockParents: selectStore.getBlockParents,
					getBlockParentsByBlockName:
						selectStore.getBlockParentsByBlockName,
				};
			}, []);

			const {
				getBlock,
				getBlockParents,
				getBlockParentsByBlockName,
			} = blockEditorSelectors;

			const {
				updateBlockAttributes,
				__unstableMarkNextChangeAsNotPersistent:
					markNextChangeAsNotPersistent,
			} = useDispatch('core/block-editor');

			const copyPasteMapping = getBlockData(name)?.copyPasteMapping;

			/** Stable object identity for useSelect when primitive fields are unchanged (@wordpress/data uses result identity). */
			const stableBlockEditorSelectRef = useRef(null);
			const stableSelectClientIdRef = useRef(clientId);
			if (stableSelectClientIdRef.current !== clientId) {
				stableSelectClientIdRef.current = clientId;
				stableBlockEditorSelectRef.current = null;
			}

			const {
				deviceType,
				baseBreakpoint,
				hasInnerBlocks,
				blockIndex,
				blockRootClientId,
				// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
				// isLastBlock,
			} = useSelect(select => {
				const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
					select('maxiBlocks');
				const {
					getBlockIndex,
					getBlockRootClientId,
					getBlockOrder: getBlockOrderFromStore,
					// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
					// getBlocks,
				} = select('core/block-editor');

				const currentBlockIndex = getBlockIndex(clientId);
				// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
				// const allBlocks = getBlocks();

				const next = {
					deviceType: receiveMaxiDeviceType(),
					baseBreakpoint: receiveBaseBreakpoint(),
					hasInnerBlocks: !isEmpty(
						getBlockOrderFromStore(clientId)
					),
					blockIndex: currentBlockIndex,
					blockRootClientId: getBlockRootClientId(clientId),
					// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
					// isLastBlock:
					// 	attributes?.isFirstOnHierarchy &&
					// 	currentBlockIndex === allBlocks.length - 1,
				};

				const prev = stableBlockEditorSelectRef.current;
				const sameAsPrev =
					prev &&
					Object.keys(next).every(k =>
						Object.is(prev[k], next[k])
					);
				if (sameAsPrev) {
					return prev;
				}
				stableBlockEditorSelectRef.current = next;
				return next;
			}, [clientId]);

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
					name,
					deviceType,
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
					<MaxiInterBlockInserterIfNotTyping
						inserterRef={ref}
						ownProps={ownProps}
					/>
					{/* TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806 */}
					{/* {isLastBlock && (
						<BlockInserter className='maxi-block-inserter maxi-block-inserter__last' />
					)} */}
				</>
			);
		}, areMaxiWithMaxiPropsOwnPropsEqual),
	'withMaxiProps'
);

export default withMaxiProps;
