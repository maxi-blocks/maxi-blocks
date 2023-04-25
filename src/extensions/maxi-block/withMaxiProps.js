/**
 * WordPress dependencies
 */
import { useSelect, dispatch, useDispatch } from '@wordpress/data';
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
import { findBlockPosition, handleBlockMove } from '../dom/detectNewBlocks';
import { getBlockData } from '../attributes';
import BlockInserter from '../../components/block-inserter';
import RepeaterContext from '../../blocks/row-maxi/repeaterContext';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';
import { diff } from 'deep-object-diff';

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const {
				setAttributes,
				attributes: rawAttributes,
				name,
				clientId,
				isSelected,
			} = ownProps;

			const repeaterContext = useContext(RepeaterContext);

			const {
				getBlock,
				getBlockAttributes,
				getBlockOrder,
				getBlockParents,
				getBlockParentsByBlockName,
			} = useSelect(select => select('core/block-editor'), []);

			const { updateBlockAttributes } = useDispatch('core/block-editor');

			const copyPasteMapping = getBlockData(name)?.copyPasteMapping;

			const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

			const parentColumnClientId =
				repeaterContext?.repeaterStatus &&
				getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/column-maxi'
				)?.[0];

			const {
				deviceType,
				baseBreakpoint,
				hasSelectedChild,
				isTyping,
				// TODO: ensure that on root clientid change it will be updated too
				blockIndex,
			} = useSelect(select => {
				const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
					select('maxiBlocks');
				const { hasSelectedInnerBlock, isTyping, getBlockIndex } =
					select('core/block-editor');

				return {
					deviceType: receiveMaxiDeviceType(),
					baseBreakpoint: receiveBaseBreakpoint(),
					hasSelectedChild: hasSelectedInnerBlock(clientId, true),
					isTyping: isTyping(),
					blockIndex: getBlockIndex(clientId),
				};
			});

			const prevBlockPositionFromColumn = useRef();

			// TODO: optimize for non-repeater blocks
			const blockPositionFromColumn = useMemo(() => {
				if (parentColumnClientId) {
					return findBlockPosition(
						ownProps,
						getBlock(parentColumnClientId)
					);
				}

				return null;
			}, [blockIndex, parentColumnClientId]);

			useEffect(() => {
				if (
					!isEqual(
						prevBlockPositionFromColumn.current,
						blockPositionFromColumn
					)
				) {
					if (
						prevBlockPositionFromColumn.current &&
						blockPositionFromColumn
					) {
						handleBlockMove(
							ownProps,
							prevBlockPositionFromColumn.current,
							blockPositionFromColumn,
							repeaterContext?.innerBlocksPositions
						);

						repeaterContext?.setIsInnerBlockWasUpdated(true);
					}

					prevBlockPositionFromColumn.current =
						blockPositionFromColumn;
				}
			}, [blockPositionFromColumn]);

			const attributes = useMemo(() => {
				if (repeaterContext?.repeaterStatus) {
					const refClientId =
						name === 'maxi-blocks/column-maxi'
							? repeaterContext?.columnRefClientId
							: repeaterContext?.innerBlocksPositions.get(
									`${blockPositionFromColumn}`
							  )?.clientId;

					if (refClientId !== clientId) {
						const refAttributes = excludeAttributes(
							getBlockAttributes(refClientId),
							copyPasteMapping
						);

						const mergedAttributes = {
							...rawAttributes,
							...refAttributes,
						};

						if (!isEqual(rawAttributes, mergedAttributes)) {
							return mergedAttributes;
						}
					}
				}

				return rawAttributes;
			});

			const maxiSetAttributes = useCallback(obj => {
				const refClientId =
					repeaterContext?.repeaterStatus &&
					name === 'maxi-blocks/column-maxi'
						? repeaterContext?.columnRefClientId
						: repeaterContext?.innerBlocksPositions.get(
								`${blockPositionFromColumn}`
						  )?.clientId;

				return handleSetAttributes({
					obj,
					attributes,
					clientId,
					onChange: obj => {
						if (
							!repeaterContext?.repeaterStatus ||
							refClientId === clientId
						) {
							setAttributes(obj);
						}

						const nonExcludedAttributes = excludeAttributes(
							obj,
							copyPasteMapping
						);
						const excludedAttributes = diff(
							nonExcludedAttributes,
							obj
						);

						if (!isEmpty(nonExcludedAttributes)) {
							updateBlockAttributes(
								refClientId,
								nonExcludedAttributes
							);
						}

						if (!isEmpty(excludedAttributes)) {
							setAttributes(excludedAttributes);
						}
					},
					someAttributesChangedCallback: () => {
						repeaterContext?.setIsInnerBlockWasUpdated(true);
					},
				});
			});

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

			// TODO: make maxiSetAttributes work with inner repeater blocks
			// TODO: normalize column(add it also to innerBlockPositions(mb rename it to blockPositions))
			// TODO: move detectNewBlocks to a better place, clean it, make it take only clientId, not whole block(check if it's possible)

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
