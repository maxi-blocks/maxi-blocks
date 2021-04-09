/**
 * Internal dependencies
 */
import setFormatWithClass from './setFormatWithClass';

/**
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {boolean} [$0.isList]				Text Maxi block has list mode active
 * @param {Object}	[$0.value]				Requested values to implement
 * 											on typography object
 * @param {string} 	[$0.breakpoint]			Device type breakpoint
 * @param {boolean}	[$0.isHover]			Is the requested typography under hover state
 *
 * @returns {Object} Formatted object
 */
const setFormat = ({
	formatValue,
	typography,
	isList,
	value,
	breakpoint = 'general',
	isHover = false,
	textLevel,
}) => {
	if (!formatValue || formatValue.start === formatValue.end) {
		const response = { ...typography };

		Object.entries(value).forEach(([key, val]) => {
			response[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] = val;
		});

		return response;
	}

	return setFormatWithClass({
		formatValue,
		isList,
		typography,
		value,
		breakpoint,
		isHover,
		textLevel,
	});
};

export default setFormat;
