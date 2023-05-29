/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getAttributesValue from '../../attributes/getAttributesValue';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import getCleanKey from '../../attributes/getCleanKey';

/**
 * General
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getMarginPaddingStyles = ({ obj, prefix = '' }) => {
	const keyWords = ['.t', '.r', '.b', '.l'];
	const keyDictionary = {
		'.t': 'top',
		'.r': 'right',
		'.b': 'bottom',
		'.l': 'left',
	};
	const typeDictionary = {
		_m: 'margin',
		_p: 'padding',
	};
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		['_m', '_p'].forEach(type =>
			keyWords.forEach(key => {
				const attributeName = getCleanKey(`${prefix}${type}${key}`);

				const [lastValue, lastUnit, value, unit] = [
					target =>
						getLastBreakpointAttribute({
							target,
							breakpoint,
							attributes: obj,
						}),
					target =>
						getAttributesValue({
							target,
							props: obj,
							breakpoint,
						}),
				].flatMap(callback =>
					['', '.u'].map(suffix =>
						callback(`${attributeName}${suffix}`)
					)
				);

				const cssProperty = `${typeDictionary[type]}-${keyDictionary[key]}`;

				if (
					!isNil(lastValue) &&
					(lastValue === value || lastUnit === unit)
				)
					response[breakpoint][cssProperty] =
						lastValue === 'auto'
							? 'auto'
							: `${lastValue}${lastUnit}`;

				if (value === '') delete response[breakpoint][cssProperty];
			})
		);
	});

	return response;
};

export default getMarginPaddingStyles;
