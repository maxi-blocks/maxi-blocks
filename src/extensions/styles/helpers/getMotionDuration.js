import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

import { isNumber, isEmpty } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getMotionDuration = obj => {
	let transitionSetting = '';

	const response = {};

	breakpoints.forEach(breakpoint => {
		const transition = getLastBreakpointAttribute(
			'motion',
			breakpoint,
			obj
		);

		console.log(transition);

		if (isNumber(transition)) transitionSetting += `${transition}s`;

		const transitionObj = {
			...(!isEmpty(transitionSetting) && {
				transition: transitionSetting,
			}),
		};

		if (!isEmpty(transitionObj)) response[breakpoint] = transitionObj;
	});

	return response;
};

export default getMotionDuration;
