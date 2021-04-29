/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../styles';
import getColumnTemplate from './getColumnTemplate';

const getColumnDefaultValue = (
	rowPattern,
	columnSizes,
	clientId,
	breakpoint
) => {
	const { getBlockOrder, getBlockRootClientId } = select('core/block-editor');
	const columns = getBlockOrder(getBlockRootClientId(clientId));
	const colPosition = columns.indexOf(clientId);

	const template = getColumnTemplate(
		getLastBreakpointAttribute('row-pattern', breakpoint, rowPattern),
		false,
		breakpoint
	);
	const defaultColumnSizes = template.content[colPosition][1];
	const cleanColumnSizes = { ...columnSizes };
	delete cleanColumnSizes[`column-size-${breakpoint}`];
	const values = { ...defaultColumnSizes, ...cleanColumnSizes };

	return getLastBreakpointAttribute('column-size', breakpoint, values);
};

export default getColumnDefaultValue;
