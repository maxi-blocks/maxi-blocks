import { form } from '../../../icons';
/**
 * Internal dependencies
 */
import setFormatWithClass from './setFormatWithClass';

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

	return setFormatWithClass({
		formatValue,
		isList,
		typography,
		value,
		breakpoint,
		isHover,
	});
};

export default setFormat;
