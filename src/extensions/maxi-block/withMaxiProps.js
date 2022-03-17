/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';
import { getDefaultAttribute } from '../styles';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

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
		const attrExistOnWinBreakpoint = !isNil(
			attributes?.[attrLabelOnWinBreakpoint],
			true
		);

		if (attrExistOnWinBreakpoint && breakpoint !== 'general') return;

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

		if (
			!attrExistOnGeneral &&
			!attrExistOnWinBreakpoint &&
			breakpoint === 'general' &&
			existHigherBreakpointAttribute
		)
			response[attrLabelOnWinBreakpoint] = value;

		if (!attrExistOnGeneral) return;

		const defaultGeneralAttribute =
			defaultAttributes?.[attrLabelOnGeneral] ??
			getDefaultAttribute(attrLabelOnGeneral, clientId, true);

		if (
			(breakpoint === 'general' ||
				attributes?.[attrLabelOnGeneral] === value) &&
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

			const maxiSetAttributes = obj =>
				handleSetAttributes({
					obj,
					attributes,
					clientId,
					onChange: setAttributes,
				});

			const insertInlineStyles = (target, styleObj) => {
				// const el =
				// 	ref?.current.edit.blockRef.current.querySelector(target);

				// Object.entries(styleObj).forEach(([key, val]) => {
				// 	el.style[key] = val;
				// });

				console.log(target, styleObj);
			};

			const cleanInlineStyles = target =>
				ref?.current.edit.blockRef.current
					.querySelector(target)
					.removeAttributes('styles');

			console.log(ref);

			return (
				<WrappedComponent
					{...ownProps}
					ref={ref}
					maxiSetAttributes={maxiSetAttributes}
					insertInlineStyles={insertInlineStyles}
				/>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
