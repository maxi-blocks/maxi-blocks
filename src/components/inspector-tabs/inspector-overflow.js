/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OverflowControl from '../overflow-control';
import ResponsiveTabsControl from '../responsive-tabs-control';

import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const overflow = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Overflow', 'maxi-blocks'),
		content: (
			<>
				<ResponsiveTabsControl
					{...getGroupAttributes(attributes, 'overflow')}
					breakpoint={deviceType}
				/>
				<OverflowControl
					{...getGroupAttributes(attributes, 'overflow')}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
				/>
			</>
		),
	};
};

export default overflow;
