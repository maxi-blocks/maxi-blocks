/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getMarginPaddingStyles = ({ obj, prefix = '' }) => {
	const keyWords = ['top', 'right', 'bottom', 'left'];
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		['margin', 'padding'].forEach(type =>
			keyWords.forEach(key => {
				const attributeName = `${prefix}${type}-${key}`;

				const [lastValue, lastUnit, value, unit] = [
					target =>
						getLastBreakpointAttribute({
							target,
							breakpoint,
							attributes: obj,
						}),
					target => obj[`${target}-${breakpoint}`],
				].flatMap(callback =>
					['', '-unit'].map(suffix =>
						callback(`${attributeName}${suffix}`)
					)
				);

				if (
					!isNil(lastValue) &&
					(lastValue === value || lastUnit === unit)
				)
					response[breakpoint][`${type}-${key}`] =
						lastValue === 'auto'
							? 'auto'
							: `${lastValue}${lastUnit}`;

				if (value === '') delete response[breakpoint][`${type}-${key}`];
			})
		);
	});

	return response;
};

export default getMarginPaddingStyles;
