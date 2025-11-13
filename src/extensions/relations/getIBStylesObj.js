/**
 * Internal dependencies
 */
import { getGroupAttributes, styleCleaner } from '@extensions/styles';
import { getSelectedIBSettings } from './utils';

const getIBStylesObj = ({
	clientId,
	sid,
	attributes,
	blockAttributes,
	breakpoint,
}) => {
	const selectedSettings = getSelectedIBSettings(clientId, sid);

	// Return empty object if selectedSettings is undefined
	if (!selectedSettings) {
		// eslint-disable-next-line no-console
		console.log(
			`getIBStylesObj: selectedSettings is undefined for sid: ${sid}`
		);
		return {};
	}

	const prefix = selectedSettings?.prefix || '';

	const newGroupAttributes = getGroupAttributes(
		attributes,
		selectedSettings?.attrGroupName,
		false,
		prefix
	);

	return styleCleaner({
		target: {
			result: selectedSettings?.helper({
				obj: newGroupAttributes,
				isIB: true,
				prefix,
				blockStyle: blockAttributes.blockStyle,
				breakpoint,
				blockAttributes: {
					...blockAttributes,
					...attributes,
				},
				target: selectedSettings?.target,
				clientId,
			}),
		},
	})?.target?.result;
};

export default getIBStylesObj;
