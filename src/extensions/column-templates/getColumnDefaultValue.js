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
			target: 'row-pattern',
			props: rowPattern,
			breakpoint,
		}),
		breakpoint
	);

	const defaultColumnSizes = template.content[colPosition][1];
	const cleanColumnSizes = { ...columnSizes };
	delete cleanColumnSizes[`column-size-${breakpoint}`];
	const values = { ...defaultColumnSizes, ...cleanColumnSizes };

	return getAttributesValue({
		target: 'column-size',
		props: values,
		breakpoint,
	});
};

export default getColumnDefaultValue;
