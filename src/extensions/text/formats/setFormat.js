/**
 * Internal dependencies
 */
import getFormattedString from './getFormattedString';
import getHasCustomFormat from './getHasCustomFormat';
import setFormatWithClass from './setFormatWithClass';
import flatFormatsWithClass from './flatFormatsWithClass';

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
		const newTypography = { ...typography };
		const newFormatValue = {
			...formatValue,
			start: 0,
			end: formatValue.formats.length,
		};

		Object.entries(value).forEach(([key, val]) => {
			newTypography[
				`${key}-${breakpoint}${isHover ? '-hover' : ''}`
			] = val;
		});

		const hasCustomFormat = getHasCustomFormat(newFormatValue, isHover);

		if (hasCustomFormat) {
			const content = getFormattedString({
				formatValue: newFormatValue,
				isList,
			});

			const {
				typography: cleanedTypography,
				content: cleanedContent,
			} = flatFormatsWithClass({
				formatValue: newFormatValue,
				typography: newTypography,
				content,
				isList,
				value,
				breakpoint,
				textLevel,
			});

			return { ...cleanedTypography, content: cleanedContent };
		}

		return newTypography;
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
