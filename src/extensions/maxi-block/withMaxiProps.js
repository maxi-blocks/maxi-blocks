/**
 * WordPress dependencies
 */
import { dispatch, select, useDispatch, useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	useCallback,
	useContext,
	useEffect,
	forwardRef,
	memo,
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
import {
	countProfile,
	getIsProfileEnabled,
	getProfileStart,
	recordProfile,
} from '@extensions/performance/profiler';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const DISABLED_BLOCKS = ['maxi-blocks/list-item-maxi'];

const InterBlockInserterSlot = memo(
	forwardRef(({ clientId, name }, ref) => {
		const isTyping = useSelect(
			select => select('core/block-editor').isTyping(),
			[]
		);

		if (isTyping || DISABLED_BLOCKS.includes(name)) return null;

		return (
			<BlockInserter.InterBlockInserter ref={ref} clientId={clientId} />
		);
	}),
	(oldProps, newProps) =>
		oldProps.clientId === newProps.clientId &&
		oldProps.name === newProps.name
);

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
			countProfile('withMaxiProps render');

			const repeaterContext = useContext(RepeaterContext);

			// Track previous relations to detect unexpected clearing
			const prevRelationsRef = useRef(attributes?.relations);
			// Track if we're in the middle of a setAttributes call
			const isSettingAttributesRef = useRef(false);
			const responsiveDebugLogRef = useRef(null);

			// Memoize selectors to prevent recreation on every render
			const blockEditorSelectors = useMemo(() => {
				const selectStore = select('core/block-editor');
				return {
					getBlock: selectStore.getBlock,
					getBlockOrder: selectStore.getBlockOrder,
					getBlockParentsByBlockName:
						selectStore.getBlockParentsByBlockName,
				};
			}, []);

			const { getBlock, getBlockOrder, getBlockParentsByBlockName } =
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
				blockIndex,
				blockRootClientId,
				// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
				// isLastBlock,
			} = useSelect(select => {
				const selectStart = getProfileStart();
				const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
					select('maxiBlocks');
				const {
					hasSelectedInnerBlock,
					getBlockIndex,
					getBlockRootClientId,
					// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
					// getBlocks,
				} = select('core/block-editor');

				const currentBlockIndex = getBlockIndex(clientId);
				const currentDeviceType = receiveMaxiDeviceType();
				const currentBaseBreakpoint = receiveBaseBreakpoint();
				const currentHasSelectedChild = hasSelectedInnerBlock(
					clientId,
					true
				);
				// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
				// const allBlocks = getBlocks();

				const selection = {
					deviceType: currentDeviceType,
					baseBreakpoint: currentBaseBreakpoint,
					hasSelectedChild: currentHasSelectedChild,
					blockIndex: currentBlockIndex,
					blockRootClientId: getBlockRootClientId(clientId),
					// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
					// isLastBlock:
					// 	attributes?.isFirstOnHierarchy &&
					// 	currentBlockIndex === allBlocks.length - 1,
				};
				recordProfile('withMaxiProps useSelect', selectStart);

				return selection;
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

			const ref = useRef(null);
			const interBlockInserterRef = useRef(null);
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

			useEffect(() => {
				if (
					!isSelected ||
					typeof console === 'undefined' ||
					!console.info ||
					!getIsProfileEnabled()
				)
					return;

				let animationFrameId;
				let timeoutId;
				let isActive = true;

				const scheduleLogSelection = logSelection => {
					if (typeof requestAnimationFrame === 'function') {
						animationFrameId = requestAnimationFrame(() => {
							timeoutId = setTimeout(logSelection, 0);
						});
					} else {
						timeoutId = setTimeout(logSelection, 0);
					}
				};

				import('@extensions/performance/responsiveDebug')
					.then(
						({
							RESPONSIVE_BREAKPOINTS,
							getDisplayDebugSnapshot,
							getResponsiveAttributeAudit,
							logDebugObject,
							logDebugObjectChunks,
							stringifyDebugValue,
						}) => {
							if (!isActive) return;

							const responsiveAudit =
								getResponsiveAttributeAudit(attributes);
							const responsiveAttributesKey = stringifyDebugValue(
								responsiveAudit.matrix
							);
							const logKey = [
								clientId,
								attributes?.uniqueID,
								deviceType,
								baseBreakpoint,
								responsiveAttributesKey,
							].join(':');

							if (responsiveDebugLogRef.current === logKey)
								return;
							responsiveDebugLogRef.current = logKey;

							const logSelection = () => {
								if (!isActive) return;

								const breakpointAttributeCounts =
									Object.fromEntries(
										RESPONSIVE_BREAKPOINTS.map(
											breakpoint => [
												breakpoint,
												Object.keys(
													responsiveAudit
														.byBreakpoint[
														breakpoint
													] || {}
												).length,
											]
										)
									);
								const summary = {
									name,
									clientId,
									uniqueID: attributes?.uniqueID,
									activeBreakpoint: deviceType,
									baseBreakpoint,
									totalAttributeCount:
										responsiveAudit.totalAttributeCount,
									responsiveAttributeCount:
										responsiveAudit.responsiveAttributeCount,
									nonResponsiveAttributeCount: Object.keys(
										responsiveAudit.nonResponsiveAttributes
									).length,
									matrixAttributeCount: Object.keys(
										responsiveAudit.matrix
									).length,
									breakpointAttributeCounts,
								};

								logDebugObject(
									'responsive audit summary',
									summary
								);
								logDebugObject(
									'responsive display',
									getDisplayDebugSnapshot(
										clientId,
										attributes?.uniqueID
									)
								);

								RESPONSIVE_BREAKPOINTS.forEach(breakpoint => {
									logDebugObjectChunks(
										`responsive attrs ${breakpoint}`,
										responsiveAudit.byBreakpoint[breakpoint]
									);
								});

								logDebugObjectChunks(
									'responsive matrix',
									responsiveAudit.matrix
								);
								logDebugObjectChunks(
									'nonresponsive attrs',
									responsiveAudit.nonResponsiveAttributes
								);
							};

							scheduleLogSelection(logSelection);
						}
					)
					.catch(() => {});

				return () => {
					isActive = false;

					if (
						animationFrameId &&
						typeof cancelAnimationFrame === 'function'
					) {
						cancelAnimationFrame(animationFrameId);
					}

					if (timeoutId) clearTimeout(timeoutId);
				};
			}, [
				isSelected,
				name,
				clientId,
				attributes,
				deviceType,
				baseBreakpoint,
			]);

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
						isChild={!!blockRootClientId}
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
					<InterBlockInserterSlot
						ref={interBlockInserterRef}
						clientId={clientId}
						name={name}
					/>
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
