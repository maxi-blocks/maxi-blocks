/**
 * Internal dependencies
 */
import __experimentalApplyLinkFormat from './applyLinkFormat';

/**
 * External dependencies
 */
import { chunk } from 'lodash';

const isFormattedWithType = (formatValue, type) => {
	return formatValue.formats.some(formatEl => {
		return formatEl.some(format => {
			return format.type === type;
		});
	});
};

const setLinkFormats = ({ formatValue, typography, isList }) => {
	formatValue.formats = formatValue.formats.map(formatEl => {
		return formatEl.map(format => {
			if (format.type === 'core/link') {
				format.type = 'maxi-blocks/text-link';
			}

			return format;
		});
	});

	const linkInstancePositions = chunk(
		formatValue.formats
			.map((formatEl, i) => {
				if (
					formatEl.some(format => {
						return format.type === 'maxi-blocks/text-link';
					})
				)
					return i;

				return null;
			})
			.filter((current, i, array) => {
				const prev = array[i - 1];
				const next = array[i + 1];

				return (
					(!prev && current + 1 === next) ||
					(!next && current - 1 === prev)
				);
			}),
		2
	);

	let newContent = formatValue.html;
	let newTypography = { ...typography };
	let newFormatValue = { ...formatValue };

	linkInstancePositions.forEach(pos => {
		newFormatValue = {
			...newFormatValue,
			start: pos[0],
			end: pos[1] + 1,
		};

		const {
			typography: preformattedTypography,
			content: preformattedContent,
			formatValue: preformattedFormatValue,
		} = __experimentalApplyLinkFormat({
			formatValue: newFormatValue,
			typography: newTypography || typography,
			isList,
		});

		newTypography = JSON.parse(preformattedTypography);
		newContent = preformattedContent;
		newFormatValue = preformattedFormatValue;
	});

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

const setCustomFormatsWhenPaste = ({ formatValue, typography, isList }) => {
	const isLinkUnformatted = isFormattedWithType(formatValue, 'core/link');

	const {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	} =
		isLinkUnformatted &&
		setLinkFormats({ formatValue, typography, isList });

	if (newContent) {
		return {
			typography: newTypography,
			content: newContent,
			formatValue: newFormatValue,
		};
	}

	return false;
};

export default setCustomFormatsWhenPaste;
