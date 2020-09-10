/**
 * WordPress dependencies
 */
const { applyFormat } = wp.richText;

/**
 * Internal dependencies
 */
import __experimentalGetUpdatedString from './getUpdatedString';
import defaultFontColorObject from './color/default';
import defaultFontUnderlineObject from './underline/default';

/**
 *
 */
const getNewFormatValue = ({
	formatValue,
	linkAttributes,
	colorFormatClassName,
	underlineFormatClassName,
}) => {
	const isFromPaste = formatValue.formats.some(formatEl => {
		return formatEl.some(format => {
			return format.type === 'core/link';
		});
	});

	if (isFromPaste) {
		formatValue.formats = formatValue.formats.map(formatEl => {
			if (
				formatEl.some(format => {
					return format.type === 'core/link';
				})
			) {
				formatEl.push({
					type: 'maxi-blocks/text-color',
					attributes: {
						className: colorFormatClassName,
					},
				});

				formatEl.push({
					type: 'maxi-blocks/text-underline',
					attributes: {
						className: underlineFormatClassName,
					},
				});
			}

			return formatEl.map(format => {
				if (format.type === 'core/link') {
					format.type = 'maxi-blocks/text-link';
				}

				return format;
			});
		});

		return formatValue;
	}

	const linkFormatValue = applyFormat(formatValue, {
		type: 'maxi-blocks/text-link',
		attributes: linkAttributes,
	});

	const colorFormatValue = applyFormat(linkFormatValue, {
		type: 'maxi-blocks/text-color',
		attributes: {
			className: colorFormatClassName,
		},
	});

	const underlineFormatValue = applyFormat(colorFormatValue, {
		type: 'maxi-blocks/text-underline',
		attributes: {
			className: underlineFormatClassName,
		},
	});

	return underlineFormatValue;
};

const applyLinkFormat = ({
	formatValue,
	typography,
	currentColorClassName,
	currentUnderlineClassName,
	linkAttributes,
	isList,
}) => {
	// Set classNames on Typography objet and delete old ones if exists
	if (typography.customFormats[currentColorClassName])
		delete typography.customFormats[currentColorClassName];

	const colorFormatClassName = `maxi-text-block__custom-font-color--${
		Object.keys(typography.customFormats).length
	}`;

	typography.customFormats[colorFormatClassName] = {
		...defaultFontColorObject,
		general: {
			color: '#ff4a17',
		},
	};

	if (typography.customFormats[currentUnderlineClassName])
		delete typography.customFormats[currentUnderlineClassName];

	const underlineFormatClassName = `maxi-text-block__custom-font-underline--${
		Object.keys(typography.customFormats).length
	}`;

	typography.customFormats[underlineFormatClassName] = {
		...defaultFontUnderlineObject,
		general: {
			'text-decoration': 'underline',
		},
	};

	const newFormatValue = getNewFormatValue({
		formatValue,
		linkAttributes,
		colorFormatClassName,
		underlineFormatClassName,
	});

	const newContent = __experimentalGetUpdatedString({
		formatValue: newFormatValue,
		formatName: 'maxi-blocks/text-link',
		isList,
		...(linkAttributes && {
			attributes: {
				attributes: linkAttributes,
			},
		}),
	});

	return {
		typography,
		content: newContent,
	};
};

export default applyLinkFormat;
