import { form } from '../../../icons';
/**
 * Internal dependencies
 */
import __experimentalSetFormatWithClass from './setFormatWithClass';

/**
 * Content
 */
const setFormat = ({
	formatValue,
	isList,
	typography,
	value,
	breakpoint = 'general',
	isHover = false,
}) => {
	if (!formatValue || formatValue.start === formatValue.end) {
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
		isHover,
	});
};

export default setFormat;
