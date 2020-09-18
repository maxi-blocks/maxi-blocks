/**
 * WordPress dependencies
 */
const { applyFormat } = wp.richText;

/**
 * Internal dependencies
 */
import __experimentalSetFormatWithClass from './setFormatWithClass';

/**
 *
 */
const getNewFormatValue = ({ formatValue, linkAttributes }) => {
	const isFromPaste = formatValue.formats.some(formatEl => {
		return formatEl.some(format => {
			return format.type === 'core/link';
		});
	});

	if (isFromPaste) {
		formatValue.formats = formatValue.formats.map(formatEl => {
			return formatEl.map(format => {
				if (format.type === 'core/link') {
					format.type = 'maxi-blocks/text-link';
				}

				return format;
			});
		});

		return formatValue;
	}

	const newFormatValue = applyFormat(formatValue, {
		type: 'maxi-blocks/text-link',
		attributes: linkAttributes,
	});

	return newFormatValue;
};

const applyLinkFormat = ({
	formatValue,
	typography,
	linkAttributes = {},
	isList,
}) => {
	const linkCustomFormatValue = getNewFormatValue({
		formatValue,
		linkAttributes,
	});

	const {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	} = __experimentalSetFormatWithClass({
		formatValue: linkCustomFormatValue,
		isList,
		typography,
		value: {
			color: '#ff4a17',
			'text-decoration': 'underline',
		},
	});

	return {
		typography: JSON.stringify(newTypography),
		content: newContent,
		formatValue: newFormatValue,
	};
};

export default applyLinkFormat;
