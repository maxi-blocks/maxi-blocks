/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import handleSetAttributes from './handleSetAttributes';

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

				return {
					deviceType,
					winBreakpoint,
					hasInnerBlocks,
					isChild,
					hasSelectedChild,
				};
			});

			const maxiSetAttributes = obj =>
				handleSetAttributes({
					obj,
					attributes,
					clientId,
					onChange: setAttributes,
				});

			const ref = useRef(null);
			const styleObjKeys = useRef([]);

			const insertInlineStyles = (styleObj, target = '') => {
				if (isEmpty(styleObj)) return;

				const parentElement = ref?.current.blockRef.current;
				const targetElements =
					target !== '' && target !== ':hover'
						? parentElement.querySelectorAll(target)
						: [parentElement];

				for (let i = 0; i < targetElements.length; i += 1) {
					const targetElement = targetElements[i];

					Object.entries(styleObj).forEach(([key, val]) => {
						targetElement.style[key] = val;
					});

					targetElement.style.transition = 'none';
				}

				styleObjKeys.current = [...Object.keys(styleObj), 'transition'];
			};

			const cleanInlineStyles = (target = '') => {
				const parentElement = ref?.current.blockRef.current;
				const targetElements =
					target !== ''
						? parentElement.querySelectorAll(target)
						: [parentElement];

				for (let i = 0; i < targetElements.length; i += 1) {
					const targetElement = targetElements[i];

					styleObjKeys.current.forEach(key => {
						if (targetElement.style[key])
							targetElement.style[key] = '';
					});
				}

				styleObjKeys.current = [];
			};

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
