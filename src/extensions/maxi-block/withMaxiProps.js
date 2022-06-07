/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useRef, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import handleSetAttributes from './handleSetAttributes';
import {
	handleInsertInlineStyles,
	handleCleanInlineStyles,
} from './inlineStyles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes, clientId } = ownProps;
			const {
				deviceType,
				winBreakpoint,
				hasInnerBlocks,
				isChild,
				hasSelectedChild,
				paneIcon,
			} = useSelect(select => {
				const { receiveMaxiDeviceType, receiveWinBreakpoint } =
					select('maxiBlocks');
				const {
					getBlockOrder,
					getBlockParents,
					hasSelectedInnerBlock,
				} = select('core/block-editor');

				const deviceType = receiveMaxiDeviceType();
				const winBreakpoint = receiveWinBreakpoint();

				const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

				const isChild = !isEmpty(
					getBlockParents(clientId).filter(val => val !== clientId)
				);

				const hasSelectedChild = hasSelectedInnerBlock(clientId, true);

				let paneIcon;

				if (ownProps.name === 'maxi-blocks/pane-maxi') {
					const {
						isBlockSelected,
						getSelectedBlockClientId,
						getBlockParentsByBlockName,
						getBlockAttributes,
					} = select('core/block-editor');

					const parentAccordion = getBlockParentsByBlockName(
						clientId,
						'maxi-blocks/accordion-maxi'
					);

					if (parentAccordion) {
						const {
							'icon-content': icon,
							'icon-content-active': iconActive,
						} = getBlockAttributes(parentAccordion);
						const paneOpen =
							isBlockSelected(clientId) ||
							getBlockParents(
								getSelectedBlockClientId()
							).includes(clientId);
						paneIcon = paneOpen ? iconActive : icon;
					}
				}

				return {
					deviceType,
					winBreakpoint,
					hasInnerBlocks,
					isChild,
					hasSelectedChild,
					paneIcon,
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
			if (ownProps.name === 'maxi-blocks/pane-maxi')
				return (
					<WrappedComponent
						{...ownProps}
						ref={ref}
						maxiSetAttributes={maxiSetAttributes}
						insertInlineStyles={insertInlineStyles}
						cleanInlineStyles={cleanInlineStyles}
						deviceType={deviceType}
						winBreakpoint={winBreakpoint}
						hasInnerBlocks={hasInnerBlocks}
						isChild={isChild}
						hasSelectedChild={hasSelectedChild}
						paneIcon={paneIcon}
					/>
				);

			return (
				<WrappedComponent
					{...ownProps}
					ref={ref}
					maxiSetAttributes={maxiSetAttributes}
					insertInlineStyles={insertInlineStyles}
					cleanInlineStyles={cleanInlineStyles}
					deviceType={deviceType}
					winBreakpoint={winBreakpoint}
					hasInnerBlocks={hasInnerBlocks}
					isChild={isChild}
					hasSelectedChild={hasSelectedChild}
				/>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
