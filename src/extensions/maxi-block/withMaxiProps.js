/**
 * WordPress dependencies
 */
import { useSelect, dispatch } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useRef, useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import handleSetAttributes from './handleSetAttributes';
import {
	handleInsertInlineStyles,
	handleCleanInlineStyles,
} from './inlineStyles';
import { BlockInserter } from '../../components';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes, clientId, isSelected } =
				ownProps;

			const [hasInterBlocksAppender, setHasInterBlocksAppender] =
				useState(false);

			const {
				deviceType,
				baseBreakpoint,
				hasInnerBlocks,
				isChild,
				hasSelectedChild,
			} = useSelect(select => {
				const { receiveMaxiDeviceType, receiveBaseBreakpoint } =
					select('maxiBlocks');
				const {
					getBlockOrder,
					getBlockParents,
					hasSelectedInnerBlock,
				} = select('core/block-editor');

				const deviceType = receiveMaxiDeviceType();
				const baseBreakpoint = receiveBaseBreakpoint();

				const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

				const isChild = !isEmpty(
					getBlockParents(clientId).filter(val => val !== clientId)
				);

				const hasSelectedChild = hasSelectedInnerBlock(clientId, true);

				return {
					deviceType,
					baseBreakpoint,
					hasInnerBlocks,
					isChild,
					hasSelectedChild,
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
					})
			);

			const cleanInlineStyles = useCallback(
				(target = '', pseudoElement = '') =>
					handleCleanInlineStyles(
						target,
						pseudoElement,
						styleObjKeys,
						ref
					)
			);

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
						deviceType={deviceType}
						baseBreakpoint={baseBreakpoint}
						hasInnerBlocks={hasInnerBlocks}
						isChild={isChild}
						hasSelectedChild={hasSelectedChild}
						hasInterBlocksAppender={hasInterBlocksAppender}
					/>

					<BlockInserter.InterBlockInserter
						ref={ref}
						setHasInterBlocksAppender={setHasInterBlocksAppender}
						{...ownProps}
					/>
				</>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
