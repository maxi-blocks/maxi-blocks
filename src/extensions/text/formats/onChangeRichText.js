/**
 * Internal dependencies
 */
import { getGroupAttributes } from '@extensions/styles';
import getHasNativeFormat from './getHasNativeFormat';
import setCustomFormatsWhenPaste from './setCustomFormatsWhenPaste';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

const onChangeRichText = ({
	attributes,
	maxiSetAttributes,
	oldFormatValue,
	onChange,
	richTextValues,
}) => {
	const { value: formatValue, onChange: onChangeRichText } = richTextValues;

	/**
	 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
	 * and add some coding manually
	 * This next script will check if there is any format directly related with
	 * any native format and if it's so, will format it in MaxiBlocks way
	 */
	const hasNativeFormat = getHasNativeFormat(formatValue);

	if (
		hasNativeFormat &&
		formatValue.start !== formatValue.end &&
		formatValue.start === oldFormatValue.start &&
		formatValue.end === oldFormatValue.end
	) {
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

	// Returns the new state
	if (!isEqual(oldFormatValue, formatValue))
		onChange({
			formatValue,
			...(onChangeRichText && {
				onChangeFormat: onChangeRichText,
			}),
		});
};

export default onChangeRichText;
