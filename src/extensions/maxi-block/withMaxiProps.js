/**
 * WordPress dependencies
 */
import { select, useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';

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
		const attrOnWinBreakpoint = attributes?.[attrLabelOnWinBreakpoint];
		const attrExistOnWinBreakpoint = !isNil(attrOnWinBreakpoint);

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

			const { deviceType, winBreakpoint } = useSelect(select => {
				const { receiveMaxiDeviceType, receiveWinBreakpoint } =
					select('maxiBlocks');

				const deviceType = receiveMaxiDeviceType();
				const winBreakpoint = receiveWinBreakpoint();

				return { deviceType, winBreakpoint };
			});

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
					deviceType={deviceType}
					winBreakpoint={winBreakpoint}
				/>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
