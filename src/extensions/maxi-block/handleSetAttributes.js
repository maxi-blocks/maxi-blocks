/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getBreakpointFromAttribute from '../attributes/getBreakpointFromAttribute';
import getDefaultAttribute from '../attributes/getDefaultAttribute';
import handleOnReset from './handleOnReset';
import cleanAttributes from './cleanAttributes';
import parseLongAttrObj from '../attributes/dictionary/parseLongAttrObj';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

const handleSetAttributes = ({
	obj: { isReset, ...rawObj },
	attributes,
	onChange,
	clientId = null,
	defaultAttributes,
	isStyleCard = false,
}) => {
	const obj = parseLongAttrObj(rawObj);

	const response = isReset ? { ...handleOnReset(obj) } : { ...obj };

	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

	Object.entries(obj).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint) return;

		const isHigherBreakpoint =
			breakpoints.indexOf(breakpoint) <
			breakpoints.indexOf(baseBreakpoint);

		if (!isHigherBreakpoint) return;

		const attrLabelOnBaseBreakpoint = `${key.slice(
			0,
			key.lastIndexOf('-')
		)}-${baseBreakpoint}`;
		const attrOnBaseBreakpoint = attributes?.[attrLabelOnBaseBreakpoint];
		const attrExistOnBaseBreakpoint = !isNil(attrOnBaseBreakpoint);
		const attrLabelOnGeneral = `${key.slice(0, key.lastIndexOf('-'))}-g`;
		const defaultGeneralAttribute =
			defaultAttributes?.[attrLabelOnGeneral] ??
			getDefaultAttribute(attrLabelOnGeneral, clientId, true);

		if (attrExistOnBaseBreakpoint && breakpoint !== 'g') return;

		// Ensures saving both General and XXL attribute when XXL attribute is already set,
		// BaseBreakpoint is XXL and breakpoint is General
		if (
			breakpoint === 'g' &&
			baseBreakpoint === 'xxl' &&
			attrExistOnBaseBreakpoint &&
			defaultGeneralAttribute !== value
		) {
			response[attrLabelOnBaseBreakpoint] = value;

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
			.slice(0, breakpoints.indexOf(baseBreakpoint))
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
			!attrExistOnBaseBreakpoint &&
			(breakpoint === 'g' || !existHigherBreakpointAttribute)
		) {
			// Checks if the higher breakpoint attribute is not on XXL
			if (
				!breakpoints
					.slice(0, breakpoints.indexOf(baseBreakpoint))
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

		const defaultOnBaseBreakpointAttribute =
			defaultAttributes?.[attrLabelOnBaseBreakpoint] ??
			getDefaultAttribute(attrLabelOnBaseBreakpoint, clientId, true);

		if (
			!attrExistOnGeneral &&
			breakpoint === 'g' &&
			(!attrExistOnBaseBreakpoint ||
				defaultOnBaseBreakpointAttribute === attrOnBaseBreakpoint)
		)
			response[attrLabelOnBaseBreakpoint] = value;

		if (!attrExistOnGeneral) return;

		if (breakpoint === 'g' && defaultOnBaseBreakpointAttribute === value) {
			response[attrLabelOnBaseBreakpoint] = value;

			return;
		}

		if (
			attributes?.[attrLabelOnGeneral] === value &&
			defaultGeneralAttribute === value
		)
			return;

		if (breakpoint !== 'g' && attrExistOnObjOnGeneral) return;

		if (breakpoint === 'g') {
			response[attrLabelOnBaseBreakpoint] = value;

			return;
		}

		response[attrLabelOnBaseBreakpoint] = attributes?.[attrLabelOnGeneral];
	});

	if (isStyleCard) return onChange(response);

	const cleanedResponse = cleanAttributes({
		newAttributes: response,
		attributes,
		clientId,
		defaultAttributes,
	});

	console.log(cleanedResponse);

	return onChange(cleanedResponse);
};

export default handleSetAttributes;
