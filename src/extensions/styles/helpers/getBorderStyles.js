/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointValue';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates border styles object
 *
 * @param {Object} obj Block border properties
 */
const getBorderStyles = (obj, isHover = false) => {
	const keyWords = [
		'top-left',
		'top-right',
		'bottom-right',
		'bottom-left',
		'top',
		'right',
		'bottom',
		'left',
	];

	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		Object.entries(obj).forEach(([key, value]) => {
			const includesBreakpoint =
				key.lastIndexOf(`-${breakpoint}${isHover ? '-hover' : ''}`) +
					`-${breakpoint}${isHover ? '-hover' : ''}`.length ===
				key.length;

			if (
				!!value &&
				includesBreakpoint &&
				!key.includes('sync') &&
				!key.includes('unit')
			) {
				const replacer = new RegExp(
					`\\b-${breakpoint}${
						isHover ? '-hover' : ''
					}\\b(?!.*\\b-${breakpoint}${isHover ? '-hover' : ''}\\b)`,
					'gm'
				);
				const newLabel = key.replace(replacer, '');

				if (!keyWords.some(key => newLabel.includes(key)))
					response[breakpoint][newLabel] = `${value}`;
				else {
					const unitKey = keyWords.filter(key =>
						newLabel.includes(key)
					)[0];
					const unit = getLastBreakpointAttribute(
						`${newLabel.replace(unitKey, 'unit')}`,
						breakpoint,
						obj,
						isHover
					);

					response[breakpoint][newLabel] = `${value}${unit}`;
				}
			}
		});
	});

	return response;
};

export default getBorderStyles;
