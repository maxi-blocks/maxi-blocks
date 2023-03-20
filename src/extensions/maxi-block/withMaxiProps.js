/**
 * WordPress dependencies
 */
import { useSelect, dispatch } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useRef, useCallback, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import handleSetAttributes from './handleSetAttributes';
import {
	handleInsertInlineStyles,
	handleCleanInlineStyles,
} from './inlineStyles';
import BlockInserter from '../../components/block-inserter';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes, clientId, isSelected } =
				ownProps;

			const { getBlockOrder, getBlockParents } = useSelect(
				select => select('core/block-editor'),
				[]
			);

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

			const maxiSetAttributes = useCallback(obj =>
				handleSetAttributes({
					obj,
					attributes,
					clientId,
					onChange: setAttributes,
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

			return (
				<>
					<WrappedComponent
						{...ownProps}
						ref={ref}
						maxiSetAttributes={maxiSetAttributes}
						insertInlineStyles={insertInlineStyles}
						cleanInlineStyles={cleanInlineStyles}
						getBounds={getBounds}
						deviceType={deviceType}
						baseBreakpoint={baseBreakpoint}
						hasInnerBlocks={!isEmpty(getBlockOrder(clientId))}
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
