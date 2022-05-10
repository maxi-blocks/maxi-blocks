/**
 * WordPress dependencies
 */
import { applyFormat, toHTMLString } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../../styles';
import getHasNativeFormat from './getHasNativeFormat';
import setCustomFormatsWhenPaste from './setCustomFormatsWhenPaste';

/**
 * External dependencies
 */
import { isEqual, find, isEmpty } from 'lodash';

const onChangeRichText = ({
	attributes,
	maxiSetAttributes,
	oldFormatValue,
	onChange,
	richTextValues,
}) => {
	let { value: formatValue } = richTextValues;
	const { onChange: onChangeRichText } = richTextValues;

	/**
	 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
	 * and add some coding manually
	 * This next script will check if there is any format directly related with
	 * any native format and if it's so, will format it in Maxi Blocks way
	 */
	const hasNativeFormat = getHasNativeFormat(formatValue);

	if (hasNativeFormat) {
		const { typeOfList, content, textLevel, isList } = attributes;

		const cleanCustomProps = setCustomFormatsWhenPaste({
			formatValue,
			typography: getGroupAttributes(attributes, 'typography'),
			isList,
			typeOfList,
			content,
			textLevel,
		});

		delete cleanCustomProps.formatValue;

		maxiSetAttributes(cleanCustomProps);
	}

	/**
	 * Ensures we keep the same link format when the text has
	 * a link in all the content
	 */
	const { formats } = formatValue;
	let isWholeLink = false;

	const containLink = formats.some(
		format => !!find(format, { type: 'maxi-blocks/text-link' })
	);

	if (containLink) {
		isWholeLink = true;

		for (let i = 0; i < formats.length; i += 1) {
			const format = formats[i];

			if (formats.length - 1 !== i) {
				if (!find(format, { type: 'maxi-blocks/text-link' }))
					isWholeLink = false;
			} else if (isWholeLink && isEmpty(format)) {
				const customFormat = find(formats[i - 2], {
					type: 'maxi-blocks/text-custom',
				});

				if (customFormat)
					formatValue = applyFormat(
						formatValue,
						customFormat,
						i,
						i + 1
					);

				const linkFormat = find(formats[i - 1], {
					type: 'maxi-blocks/text-link',
				});

				if (linkFormat)
					formatValue = applyFormat(
						formatValue,
						linkFormat,
						i,
						i + 1
					);

				// Needs a time out to avoid recalling this function on the render cycle
				// eslint-disable-next-line no-loop-func
				setTimeout(() => {
					onChangeRichText(formatValue);
				}, 1);
			}
		}
	}

	// Returns the new state
	if (!isEqual(oldFormatValue, formatValue)) {
		// Avoid saving state on the render cycle
		setTimeout(() => {
			onChange(
				{
					formatValue,
					...(onChangeRichText && {
						onChangeFormat: onChangeRichText,
					}),
				},
				isWholeLink && toHTMLString({ value: formatValue })
			);
		}, 50);
	}
};

export default onChangeRichText;
