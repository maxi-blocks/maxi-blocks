/**
 * WordPress dependencies
 */
import { useSelect, dispatch } from '@wordpress/data';
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
import BlockInserter from '../../components/block-inserter';
import RepeaterContext from '../../blocks/row-maxi/repeaterContext';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';
import { findBlockPosition } from '../dom/detectNewBlocks';
import { getBlockData } from '../attributes';

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

			const copyPasteMapping = getBlockData(name)?.copyPasteMapping;

			const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

			const parentColumnClientId =
				repeaterContext?.repeaterStatus &&
				getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/column-maxi'
				)?.[0];

			const blockPositionFromColumn =
				parentColumnClientId &&
				findBlockPosition(ownProps, getBlock(parentColumnClientId));

			const { deviceType, baseBreakpoint, hasSelectedChild, isTyping } =
				useSelect(select => {
					const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
						select('maxiBlocks');
					const { hasSelectedInnerBlock, isTyping } =
						select('core/block-editor');

					return {
						deviceType: receiveMaxiDeviceType(),
						baseBreakpoint: receiveBaseBreakpoint(),
						hasSelectedChild: hasSelectedInnerBlock(clientId, true),
						isTyping: isTyping(),
					};
				});

			const attributes = useMemo(() => {
				if (repeaterContext?.repeaterStatus) {
					const refClientId =
						name === 'maxi-blocks/column-maxi'
							? repeaterContext?.columnRefClientId
							: repeaterContext?.innerBlocksPositions.get(
									`${blockPositionFromColumn}`
							  );

					if (refClientId !== clientId) {
						// TODO: interesting...it makes row re-render, but we should optimize
						// it to only re-render the blocks that are affected by the change
						// repeaterContext?.setLastUpdatedBlockPosition(
						// 	blockPositionFromColumn
						// );

						return {
							...rawAttributes,
							...excludeAttributes(
								getBlockAttributes(refClientId),
								copyPasteMapping
							),
						};
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
						  );

				return handleSetAttributes({
					obj,
					attributes,
					clientId,
					onChange:
						repeaterContext?.repeaterStatus &&
						refClientId !== clientId
							? newAttributes => {
									dispatch(
										'core/block-editor'
									).updateBlockAttributes(
										refClientId,
										newAttributes
									);
							  }
							: setAttributes,
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
