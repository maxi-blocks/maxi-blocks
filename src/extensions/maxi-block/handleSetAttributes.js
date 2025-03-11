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
	console.log('response at the beginning', response);
	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

	Object.entries(response).forEach(([key, value]) => {
		if (key.includes('general')) {
			const baseBreakpointKey = key.replace('general', baseBreakpoint);
			response[baseBreakpointKey] = value;
			delete response[key];
		}
	});

	Object.entries(obj).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint) return;

		const isHigherThanBase =
			breakpoints.indexOf(breakpoint) <
			breakpoints.indexOf(baseBreakpoint);

		if (!isHigherThanBase) return;

		const attrLabelOnGeneral = `${key.slice(
			0,
			key.lastIndexOf('-')
		)}-general`;
		const attrLabelOnBaseBreakpoint = `${key.slice(
			0,
			key.lastIndexOf('-')
		)}-${baseBreakpoint}`;

		const attrOnBaseBreakpoint = attributes?.[attrLabelOnBaseBreakpoint];
		const attrExistOnBaseBreakpoint = !isNil(attrOnBaseBreakpoint);
		const defaultGeneralAttribute =
			defaultAttributes?.[attrLabelOnGeneral] ??
			getDefaultAttribute(attrLabelOnGeneral, clientId, true);
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
			console.log(
				'response after setting attrLabelOnBaseBreakpoint 1',
				response
			);
		}

		if (!attrExistOnGeneral) return;

		if (
			breakpoint === 'general' &&
			defaultOnBaseBreakpointAttribute === value
		) {
			response[attrLabelOnBaseBreakpoint] = value;
			console.log(
				'response after setting attrLabelOnBaseBreakpoint 2',
				response
			);
			return;
		}

		if (
			attributes?.[attrLabelOnGeneral] === value &&
			defaultGeneralAttribute === value
		)
			return;

		// response[attrLabelOnBaseBreakpoint] = attributes?.[attrLabelOnGeneral];
		console.log(
			'response after setting attrLabelOnBaseBreakpoint 4',
			response
		);
	});

	console.log('response before cleaning', response);

	const cleanedResponse = cleanAttributes({
		newAttributes: response,
		attributes,
		clientId,
		targetClientId,
		defaultAttributes,
		allowXXLOverGeneral,
	});
	console.log('cleanedResponse', cleanedResponse);

	return onChange(cleanedResponse);
};

export default handleSetAttributes;
