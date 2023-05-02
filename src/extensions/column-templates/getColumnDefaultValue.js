/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getAttributesValue } from '../attributes';
import getColumnTemplate from './getColumnTemplate';

const getColumnDefaultValue = (
	rowPattern,
	columnSizes,
	clientId,
	breakpoint
) => {
	if (breakpoint !== 'general') return null;

	const { getBlockOrder, getBlockRootClientId } = select('core/block-editor');
	const columns = getBlockOrder(getBlockRootClientId(clientId));
	const colPosition = columns.indexOf(clientId);

	const template = getColumnTemplate(
		getAttributesValue({
			target: '_rp',
			props: rowPattern,
			breakpoint,
		}),
		breakpoint
	);

	const defaultColumnSizes = template.content[colPosition][1];
	const cleanColumnSizes = { ...columnSizes };
	delete cleanColumnSizes[`_cs-${breakpoint}`];
	const values = { ...defaultColumnSizes, ...cleanColumnSizes };

	return getAttributesValue({
		target: '_cs',
		props: values,
		breakpoint,
	});
};

export default getColumnDefaultValue;
