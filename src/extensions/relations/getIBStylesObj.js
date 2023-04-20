/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import { getSelectedIBSettings } from './utils';

const getIBStylesObj = ({
	clientId,
	sid,
	attributes,
	blockAttributes,
	breakpoint,
}) => {
	const selectedSettings = getSelectedIBSettings(clientId, sid);

	const prefix = selectedSettings?.prefix || '';

	const newGroupAttributes = getGroupAttributes(
		attributes,
		selectedSettings.attrGroupName,
		false,
		prefix
	);

	return selectedSettings?.helper({
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
	});
};

export default getIBStylesObj;
