/**
 * Internal dependencies
 */
import __experimentalSetFormatWithClass from './setFormatWithClass';

/**
 * Content
 */
const setFormat = ({
	formatValue,
	isActive,
	isList,
	typography,
	value,
	breakpoint = 'general',
	isHover = false,
}) => {
	const { start, end } = formatValue;

	if (start === end) {
		Object.entries(value).forEach(([key, val]) => {
			typography[breakpoint][key] = val;
		});

		return { typography };
	}

	return __experimentalSetFormatWithClass({
		formatValue,
		isList,
		typography,
		value,
		breakpoint,
	});
};

export default setFormat;
