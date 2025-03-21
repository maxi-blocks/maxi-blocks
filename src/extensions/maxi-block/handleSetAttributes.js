/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBreakpointFromAttribute } from '@extensions/styles/utils';
import getDefaultAttribute from '@extensions/styles/getDefaultAttribute';
import handleOnReset from '@extensions/attributes/handleOnReset';
import cleanAttributes from './cleanAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

const handleSetAttributes = ({
	obj: { isReset, ...obj },
	attributes,
	onChange,
	clientId = null,
	targetClientId = null,
	defaultAttributes,
	allowXXLOverGeneral = false,
}) => {
	const response = isReset ? { ...handleOnReset(obj) } : { ...obj };
	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

	// First pass: handle general -> baseBreakpoint conversion
	Object.entries(response).forEach(([key, value]) => {
		if (key.includes('general')) {
			const baseBreakpointKey = key.replace('general', baseBreakpoint);
			response[baseBreakpointKey] = value;
			delete response[key];
		}
	});

	// Second pass: handle breakpoint attributes
	Object.entries(obj).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);
		if (!breakpoint) return;

		const isHigherThanBase =
			breakpoints.indexOf(breakpoint) <
			breakpoints.indexOf(baseBreakpoint);

		if (!isHigherThanBase) return;

		const attrLabelOnGeneral = key.includes('general')
			? key
			: `${key.slice(0, key.lastIndexOf('-'))}-general`;
		const attrLabelOnBaseBreakpoint = key.includes('general')
			? key.replace('general', baseBreakpoint)
			: key.replace(breakpoint, baseBreakpoint);

		const attrOnBaseBreakpoint = attributes?.[attrLabelOnBaseBreakpoint];
		const attrExistOnBaseBreakpoint = !isNil(attrOnBaseBreakpoint);

		if (attrExistOnBaseBreakpoint && breakpoint !== 'general') return;

		const attrExistOnGeneral = !isNil(
			attributes?.[attrLabelOnGeneral],
			true
		);

		const defaultOnBaseBreakpointAttribute =
			defaultAttributes?.[attrLabelOnBaseBreakpoint] ??
			getDefaultAttribute(attrLabelOnBaseBreakpoint, clientId, true);
		if (
			!attrExistOnGeneral &&
			breakpoint === 'general' &&
			(!attrExistOnBaseBreakpoint ||
				defaultOnBaseBreakpointAttribute === attrOnBaseBreakpoint)
		) {
			response[attrLabelOnBaseBreakpoint] = value;
		}

		if (!attrExistOnGeneral) return;

		if (
			breakpoint === 'general' &&
			defaultOnBaseBreakpointAttribute === value
		) {
			response[attrLabelOnBaseBreakpoint] = value;
		}
	});

	const cleanedResponse = cleanAttributes({
		newAttributes: response,
		attributes,
		clientId,
		targetClientId,
		defaultAttributes,
		allowXXLOverGeneral,
	});

	return onChange(cleanedResponse);
};

export default handleSetAttributes;
