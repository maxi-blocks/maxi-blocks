/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

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

const handleSetAttributes = ({
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
		const attrLabelOnGeneral = `${key.slice(
			0,
			key.lastIndexOf('-')
		)}-general`;
		const defaultGeneralAttribute =
			defaultAttributes?.[attrLabelOnGeneral] ??
			getDefaultAttribute(attrLabelOnGeneral, clientId, true);

		if (attrExistOnWinBreakpoint && breakpoint !== 'general') return;

		// Ensures saving both General and XXL attribute when XXL attribute is already set,
		// winBreakpoint is XXL and breakpoint is General
		if (
			breakpoint === 'general' &&
			winBreakpoint === 'xxl' &&
			attrExistOnWinBreakpoint &&
			defaultGeneralAttribute !== value
		) {
			response[attrLabelOnWinBreakpoint] = value;

			return;
		}

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
			!attrExistOnWinBreakpoint &&
			(breakpoint === 'general' || !existHigherBreakpointAttribute)
		) {
			// Checks if the higher breakpoint attribute is not on XXL
			if (
				!breakpoints
					.slice(0, breakpoints.indexOf(winBreakpoint))
					.some(
						breakpoint =>
							breakpoint !== 'xxl' &&
							!isNil(
								attributes?.[
									`${key.slice(
										0,
										key.lastIndexOf('-')
									)}-${breakpoint}`
								]
							)
					)
			)
				return;
		}

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

export default handleSetAttributes;
