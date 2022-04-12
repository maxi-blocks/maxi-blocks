/**
 * WordPress dependencies
 */
import { select, useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';
import { getDefaultAttribute } from '../styles';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

export const handleSetAttributes = ({
	obj,
	attributes,
	onChange,
	clientId = null,
	defaultAttributes,
}) => {
	const response = { ...obj };

	const winBreakpoint = select('maxiBlocks').receiveWinBreakpoint();

	Object.entries(obj).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint) return;

		const isHigherBreakpoint =
			breakpoints.indexOf(breakpoint) <
			breakpoints.indexOf(winBreakpoint);

		if (!isHigherBreakpoint) return;

		const attrLabelOnWinBreakpoint = `${key.slice(
			0,
			key.lastIndexOf('-')
		)}-${winBreakpoint}`;
		const attrOnWinBreakpoint = attributes?.[attrLabelOnWinBreakpoint];
		const attrExistOnWinBreakpoint = !isNil(attrOnWinBreakpoint);

		if (attrExistOnWinBreakpoint && breakpoint !== 'general') return;

		// Ensures saving both General and XXL attribute when XXL attribute is already set,
		// winBreakpoint is XXL and breakpoint is General
		if (
			breakpoint === 'general' &&
			winBreakpoint === 'xxl' &&
			attrExistOnWinBreakpoint
		) {
			response[attrLabelOnWinBreakpoint] = value;

			return;
		}

		const attrLabelOnGeneral = `${key.slice(
			0,
			key.lastIndexOf('-')
		)}-general`;

		const attrExistOnGeneral = !isNil(
			attributes?.[attrLabelOnGeneral],
			true
		);
		const attrExistOnObjOnGeneral = attrLabelOnGeneral in obj;

		// When changing a number that needs more than 2 digits, it is saved digit by digit
		// Need to make both be saved in same conditions
		const needsGeneralAttr =
			attributes?.[attrLabelOnGeneral] === attributes?.[key];

		if (
			(!attrExistOnGeneral || needsGeneralAttr) &&
			!attrExistOnObjOnGeneral &&
			breakpoint === 'xxl'
		)
			response[attrLabelOnGeneral] = value;

		if (breakpoint === 'xxl' && needsGeneralAttr) return;

		const existHigherBreakpointAttribute = breakpoints
			.slice(0, breakpoints.indexOf(winBreakpoint))
			.some(
				breakpoint =>
					!isNil(
						attributes?.[
							`${key.slice(
								0,
								key.lastIndexOf('-')
							)}-${breakpoint}`
						]
					)
			);

		const defaultOnWinBreakpointAttribute =
			defaultAttributes?.[attrLabelOnWinBreakpoint] ??
			getDefaultAttribute(attrLabelOnWinBreakpoint, clientId, true);

		if (
			!attrExistOnGeneral &&
			existHigherBreakpointAttribute &&
			breakpoint === 'general' &&
			(!attrExistOnWinBreakpoint ||
				defaultOnWinBreakpointAttribute === attrOnWinBreakpoint)
		)
			response[attrLabelOnWinBreakpoint] = value;

		if (!attrExistOnGeneral) return;

		if (
			breakpoint === 'general' &&
			defaultOnWinBreakpointAttribute === value
		) {
			response[attrLabelOnWinBreakpoint] = value;

			return;
		}

		const defaultGeneralAttribute =
			defaultAttributes?.[attrLabelOnGeneral] ??
			getDefaultAttribute(attrLabelOnGeneral, clientId, true);

		if (
			attributes?.[attrLabelOnGeneral] === value &&
			defaultGeneralAttribute === value
		)
			return;

		if (breakpoint !== 'general' && attrExistOnObjOnGeneral) return;

		if (breakpoint === 'general' && !existHigherBreakpointAttribute) return;

		if (breakpoint === 'general') {
			response[attrLabelOnWinBreakpoint] = value;

			return;
		}

		response[attrLabelOnWinBreakpoint] = attributes?.[attrLabelOnGeneral];
	});

	return onChange(response);
};

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes, clientId } = ownProps;

			const ref = useRef(null);
			const { deviceType, winBreakpoint, hasInnerBlocks } = useSelect(
				select => {
					const { receiveMaxiDeviceType, receiveWinBreakpoint } =
						select('maxiBlocks');
					const { getBlockOrder } = select('core/block-editor');

					const deviceType = receiveMaxiDeviceType();
					const winBreakpoint = receiveWinBreakpoint();

					const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

					return { deviceType, winBreakpoint, hasInnerBlocks };
				}
			);

			const maxiSetAttributes = obj =>
				handleSetAttributes({
					obj,
					attributes,
					clientId,
					onChange: setAttributes,
				});

			const [styleObjKeys, setStyleObjKeys] = useState([]);

			const insertInlineStyles = (styleObj, target = '') => {
				if (isEmpty(styleObj)) return;

				const parentElement = ref?.current.blockRef.current;
				const targetElement =
					target !== ''
						? parentElement.querySelector(target)
						: parentElement;

				Object.entries(styleObj).forEach(([key, val]) => {
					targetElement.style[key] = val;
				});

				setStyleObjKeys(Object.keys(styleObj));
			};

			const cleanInlineStyles = (target = '') => {
				const parentElement = ref?.current.blockRef.current;
				const targetElement =
					target !== ''
						? parentElement.querySelector(target)
						: parentElement;

				const getAllInlineElements = element => {
					const inlineElements = [element];

					if (element.children.length) {
						for (let i = 0; i < element.children.length; i += 1) {
							inlineElements.push(
								...getAllInlineElements(element.children[i])
							);
						}
					} else {
						inlineElements.push(element);
					}

					return inlineElements;
				};

				const inlineElements = getAllInlineElements(targetElement);

				inlineElements.forEach(element => {
					styleObjKeys.forEach(key => {
						if (element.style[key]) element.style[key] = '';
					});
				});
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
				/>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
