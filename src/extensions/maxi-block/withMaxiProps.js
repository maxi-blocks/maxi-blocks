import { select } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';
import { getDefaultAttribute } from '../styles';

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

		const isHigherBreakpoint =
			breakpoints.indexOf(breakpoint) <
			breakpoints.indexOf(winBreakpoint);

		if (!isHigherBreakpoint) return;

		const attrLabelOnWinBreakpoint = `${key.slice(
			0,
			key.lastIndexOf('-')
		)}-${winBreakpoint}`;
		const attrExistOnWinBreakpoint = !isNil(
			attributes[attrLabelOnWinBreakpoint],
			true
		);

		if (attrExistOnWinBreakpoint && breakpoint !== 'general') return;

		const attrLabelOnGeneral = `${key.slice(
			0,
			key.lastIndexOf('-')
		)}-general`;

		const attrExistOnGeneral = !isNil(attributes[attrLabelOnGeneral], true);
		const attrExistOnObjOnGeneral = attrLabelOnGeneral in obj;

		if (
			!attrExistOnGeneral &&
			!attrExistOnObjOnGeneral &&
			breakpoint === 'xxl'
		)
			response[attrLabelOnGeneral] = value;

		const existHigherBreakpointAttribute = breakpoints
			.slice(0, breakpoints.indexOf(winBreakpoint))
			.some(
				breakpoint =>
					!isNil(
						attributes[
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

		// Needs defaultattributes compatibility!
		const defaultGeneralAttribute = getDefaultAttribute(
			attrLabelOnGeneral,
			clientId
		);

		if (
			(breakpoint === 'general' ||
				attributes[attrLabelOnGeneral] === value) &&
			defaultGeneralAttribute === value
		)
			return;

		if (breakpoint !== 'general' && attrExistOnObjOnGeneral) return;

		if (breakpoint === 'general' && !existHigherBreakpointAttribute) return;

		if (breakpoint === 'general') {
			response[attrLabelOnWinBreakpoint] = value;

			return;
		}

		response[attrLabelOnWinBreakpoint] = attributes[attrLabelOnGeneral];
	});

	onChange(response);
};

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes, clientId } = ownProps;

			const maxiSetAttributes = obj =>
				handleSetAttributes({
					obj,
					attributes,
					clientId,
					onChange: setAttributes,
				});

			return (
				<WrappedComponent
					{...ownProps}
					maxiSetAttributes={maxiSetAttributes}
				/>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
