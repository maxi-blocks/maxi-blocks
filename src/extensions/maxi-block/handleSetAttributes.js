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
	console.log('===============handleSetAttributes==================');
	console.log('obj', obj);
	console.log('attributes', attributes);
	console.log('defaultAttributes', defaultAttributes);

	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

	Object.entries(obj).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint) return;
		console.log('breakpoint', breakpoint);

		const isHigherThanBase =
			breakpoints.indexOf(breakpoint) <
			breakpoints.indexOf(baseBreakpoint);
		console.log('isHigherThanBase', isHigherThanBase);

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
		const attrExistOnObjOnGeneral = attrLabelOnGeneral in obj;

		// When changing a number that needs more than 2 digits, it is saved digit by digit
		// Need to make both be saved in same conditions
		// const needsGeneralAttr =
		// 	attributes?.[attrLabelOnGeneral] === attributes?.[key];

		// if (
		// 	(!attrExistOnGeneral || needsGeneralAttr) &&
		// 	!attrExistOnObjOnGeneral &&
		// 	breakpoint === 'xxl'
		// )
		// 	response[attrLabelOnGeneral] = value;

		// if (breakpoint === 'xxl' && needsGeneralAttr) return;

		// const existHigherBreakpointAttribute = breakpoints
		// 	.slice(0, breakpoints.indexOf(baseBreakpoint))
		// 	.some(
		// 		breakpoint =>
		// 			!isNil(
		// 				attributes?.[
		// 					`${key.slice(
		// 						0,
		// 						key.lastIndexOf('-')
		// 					)}-${breakpoint}`
		// 				]
		// 			)
		// 	);

		// if (
		// 	!attrExistOnBaseBreakpoint &&
		// 	baseBreakpoint !== 'xxl' &&
		// 	(breakpoint === 'general' || !existHigherBreakpointAttribute)
		// ) {
		// 	// Checks if the higher breakpoint attribute is not on XXL
		// 	if (
		// 		!breakpoints
		// 			.slice(0, breakpoints.indexOf(baseBreakpoint))
		// 			.some(
		// 				breakpoint =>
		// 					breakpoint !== 'xxl' &&
		// 					!isNil(
		// 						attributes?.[
		// 							`${key.slice(
		// 								0,
		// 								key.lastIndexOf('-')
		// 							)}-${breakpoint}`
		// 						]
		// 					)
		// 			)
		// 	)
		// 		return;
		// }

		const defaultOnBaseBreakpointAttribute =
			defaultAttributes?.[attrLabelOnBaseBreakpoint] ??
			getDefaultAttribute(attrLabelOnBaseBreakpoint, clientId, true);
		console.log(
			'defaultOnBaseBreakpointAttribute',
			defaultOnBaseBreakpointAttribute
		);
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

		if (breakpoint !== 'general' && attrExistOnObjOnGeneral) return;

		if (breakpoint === 'general') {
			response[attrLabelOnBaseBreakpoint] = value;
			console.log(
				'response after setting attrLabelOnBaseBreakpoint 3',
				response
			);

			return;
		}

		response[attrLabelOnBaseBreakpoint] = attributes?.[attrLabelOnGeneral];
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
	console.log('=============== End handleSetAttributes ===================');
	// clean general from cleanedResponse
	const cleanedResponseWithoutGeneral = Object.fromEntries(
		Object.entries(cleanedResponse).filter(
			([key]) => !key.includes('general')
		)
	);
	console.log('cleanedResponseWithoutGeneral', cleanedResponseWithoutGeneral);

	return onChange(cleanedResponseWithoutGeneral);
};

export default handleSetAttributes;
