/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates border styles object
 *
 * @param {Object} obj Block border properties
 */
const getBorderStyles = ({
	obj,
	isHover = false,
	prefix = '',
	parentBlockStyle,
}) => {
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
			const newKey = prefix ? key.replace(prefix, '') : key;

			const includesBreakpoint =
				newKey.lastIndexOf(`-${breakpoint}${isHover ? '-hover' : ''}`) +
					`-${breakpoint}${isHover ? '-hover' : ''}`.length ===
				newKey.length;

			if (
				!!value &&
				includesBreakpoint &&
				!newKey.includes('sync') &&
				!newKey.includes('unit')
			) {
				const replacer = new RegExp(
					`\\b-${breakpoint}${
						isHover ? '-hover' : ''
					}\\b(?!.*\\b-${breakpoint}${isHover ? '-hover' : ''}\\b)`,
					'gm'
				);
				const newLabel = newKey.replace(replacer, '');

				if (!keyWords.some(key => newLabel.includes(key))) {
					if (key.includes('color')) {
						if (
							response[breakpoint]['border-color'] ||
							breakpoint === 'general'
						)
							return;

						if (
							obj[
								`${prefix}border-palette-color-status-${breakpoint}`
							] &&
							obj[`${prefix}border-palette-color-${breakpoint}`]
						)
							response[breakpoint][
								'border-color'
							] = `var(--maxi-${parentBlockStyle}-color-${
								obj[
									`${prefix}border-palette-color-${breakpoint}`
								]
							});`;
					} else response[breakpoint][newLabel] = `${value}`;
				} else {
					const unitKey = keyWords.filter(key =>
						newLabel.includes(key)
					)[0];
					const unit = getLastBreakpointAttribute(
						`${prefix}${newLabel.replace(unitKey, 'unit')}`,
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
