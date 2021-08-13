/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getMarginPaddingStyles = (obj, prefix = '') => {
	const keyWords = ['top', 'right', 'bottom', 'left'];

	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		Object.entries(obj).forEach(([key, value]) => {
			const newKey = key.replace(prefix, '');

			const includesBreakpoint =
				newKey.lastIndexOf(`-${breakpoint}`) +
					`-${breakpoint}`.length ===
				newKey.length;

			if (
				value !== undefined &&
				value !== '' &&
				includesBreakpoint &&
				!newKey.includes('sync') &&
				!newKey.includes('unit')
			) {
				const replacer = new RegExp(
					`\\b-${breakpoint}\\b(?!.*\\b-${breakpoint}\\b)`,
					'gm'
				);
				const newLabel = newKey.replace(replacer, '');

				if (
					!keyWords.some(key => newLabel.includes(key)) ||
					value === 0
				)
					response[breakpoint][newLabel] = `${value}`;
				else {
					const unitKey = keyWords.filter(key =>
						newLabel.includes(key)
					);

					const unit = getLastBreakpointAttribute(
						`${prefix}${newLabel.replace(unitKey, 'unit')}`,
						breakpoint,
						obj
					);

					response[breakpoint][newLabel] =
						value === 'auto' ? 'auto' : `${value}${unit}`;
				}
			}
		});
	});

	return response;
};

export default getMarginPaddingStyles;
