/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../styles';
import getColumnTemplate from './getColumnTemplate';

const getColumnDefaultValue = (rowPattern, clientId, breakpoint) => {
	const { getBlockOrder, getBlockRootClientId } = select('core/block-editor');
	const columns = getBlockOrder(getBlockRootClientId(clientId));
	const colPosition = columns.indexOf(clientId);

	const template = getColumnTemplate(
		getLastBreakpointAttribute('row-pattern', breakpoint, rowPattern),
		false,
		breakpoint
	);

	return getLastBreakpointAttribute(
		'column-size',
		breakpoint,
		template.content[colPosition][1]
	);
};

export default getColumnDefaultValue;
