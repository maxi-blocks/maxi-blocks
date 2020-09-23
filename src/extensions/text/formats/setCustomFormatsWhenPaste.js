/**
 * WordPress dependencies
 */
const { removeFormat } = wp.richText;

/**
 * Internal dependencies
 */
import __experimentalApplyLinkFormat from './applyLinkFormat';
import __experimentalSetFormatWithClass from './setFormatWithClass';

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

const getInstancePositions = (formatValue, formatName) => {
	return chunk(
		formatValue.formats
			.map((formatEl, i) => {
				if (
					formatEl.some(format => {
						return format.type === formatName;
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
};

const setLinkFormats = ({ formatValue, typography, isList }) => {
	const linkInstancePositions = getInstancePositions(
		formatValue,
		'core/link'
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

		const newAttributes = newFormatValue.formats[pos[0]].filter(format => {
			return format.type === 'core/link';
		})[0].attributes;
		newFormatValue = removeFormat(newFormatValue, 'core/link');

		const {
			typography: preformattedTypography,
			content: preformattedContent,
			formatValue: preformattedFormatValue,
		} = __experimentalApplyLinkFormat({
			formatValue: newFormatValue,
			typography: newTypography || typography,
			linkAttributes: newAttributes,
			isList,
		});

		newTypography = preformattedTypography;
		newContent = preformattedContent;
		newFormatValue = preformattedFormatValue;
	});

	return {
		typography: newTypography,
		content: newContent,
		formatValue: newFormatValue,
	};
};

const setFormat = ({ formatValue, typography, oldFormat, value, isList }) => {
	const boldInstancePositions = getInstancePositions(formatValue, oldFormat);

	let newContent = formatValue.html;
	let newTypography = { ...typography };
	let newFormatValue = { ...formatValue };

	boldInstancePositions.forEach(pos => {
		newFormatValue = {
			...newFormatValue,
			start: pos[0],
			end: pos[1] + 1,
		};

		newFormatValue = removeFormat(newFormatValue, oldFormat);

		const {
			typography: preformattedTypography,
			content: preformattedContent,
			formatValue: preformattedFormatValue,
		} = __experimentalSetFormatWithClass({
			formatValue: newFormatValue,
			typography: newTypography,
			value,
			isList,
		});

		newTypography = preformattedTypography;
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
	const isBoldUnformatted = isFormattedWithType(formatValue, 'core/bold');
	const isItalicUnformatted = isFormattedWithType(formatValue, 'core/italic');
	const isUnderlineUnformatted = isFormattedWithType(
		formatValue,
		'core/underline'
	);
	const isStrikethroughUnformatted = isFormattedWithType(
		formatValue,
		'core/strikethrough'
	);
	const isSubscriptUnformatted = isFormattedWithType(
		formatValue,
		'core/subscript'
	);
	const isSuperscriptUnformatted = isFormattedWithType(
		formatValue,
		'core/superscript'
	);

	let newTypography = { ...typography };
	let newContent = '';
	let newFormatValue = { ...formatValue };

	if (isLinkUnformatted) {
		const {
			typography: linkFormattedTypography,
			content: linkFormattedContent,
			formatValue: linkFormattedFormatValue,
		} = setLinkFormats({ formatValue, typography, isList });

		newTypography = linkFormattedTypography;
		newContent = linkFormattedContent;
		newFormatValue = linkFormattedFormatValue;
	}
	if (isBoldUnformatted) {
		const {
			typography: boldFormattedTypography,
			content: boldFormattedContent,
			formatValue: boldFormattedFormatValue,
		} = setFormat({
			formatValue,
			typography,
			oldFormat: 'core/bold',
			value: { 'font-weight': 800 },
			isList,
		});

		newTypography = boldFormattedTypography;
		newContent = boldFormattedContent;
		newFormatValue = boldFormattedFormatValue;
	}
	if (isItalicUnformatted) {
		const {
			typography: italicFormattedTypography,
			content: italicFormattedContent,
			formatValue: italicFormattedFormatValue,
		} = setFormat({
			formatValue,
			typography,
			oldFormat: 'core/italic',
			value: { 'font-style': 'italic' },
			isList,
		});

		newTypography = italicFormattedTypography;
		newContent = italicFormattedContent;
		newFormatValue = italicFormattedFormatValue;
	}
	if (isUnderlineUnformatted) {
		const {
			typography: underlineFormattedTypography,
			content: underlineFormattedContent,
			formatValue: underlineFormattedFormatValue,
		} = setFormat({
			formatValue,
			typography,
			oldFormat: 'core/underline',
			value: { 'font-decoration': 'underline' },
			isList,
		});

		newTypography = underlineFormattedTypography;
		newContent = underlineFormattedContent;
		newFormatValue = underlineFormattedFormatValue;
	}
	if (isStrikethroughUnformatted) {
		const {
			typography: strikethroughFormattedTypography,
			content: strikethroughFormattedContent,
			formatValue: strikethroughFormattedFormatValue,
		} = setFormat({
			formatValue,
			typography,
			oldFormat: 'core/strikethrough',
			value: { 'font-decoration': 'strikethrough' },
			isList,
		});

		newTypography = strikethroughFormattedTypography;
		newContent = strikethroughFormattedContent;
		newFormatValue = strikethroughFormattedFormatValue;
	}
	if (isSubscriptUnformatted) {
		const {
			typography: subscriptFormattedTypography,
			content: subscriptFormattedContent,
			formatValue: subscriptFormattedFormatValue,
		} = setFormat({
			formatValue,
			typography,
			oldFormat: 'core/subscript',
			value: { 'vertical-align': 'sub' },
			isList,
		});

		newTypography = subscriptFormattedTypography;
		newContent = subscriptFormattedContent;
		newFormatValue = subscriptFormattedFormatValue;
	}
	if (isSuperscriptUnformatted) {
		const {
			typography: superscriptFormattedTypography,
			content: superscriptFormattedContent,
			formatValue: superscriptFormattedFormatValue,
		} = setFormat({
			formatValue,
			typography,
			oldFormat: 'core/superscript',
			value: { 'vertical-align': 'super' },
			isList,
		});

		newTypography = superscriptFormattedTypography;
		newContent = superscriptFormattedContent;
		newFormatValue = superscriptFormattedFormatValue;
	}

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
