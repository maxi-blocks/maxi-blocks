/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PositionControl from '../position-control';
import { getGroupAttributes } from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * Component
 */
const position = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	const ignoreIndicator =
		attributes['position-general'] === 'default'
			? Object.keys(getGroupAttributes(attributes, 'position')).filter(
					key => key.includes('general')
			  )
			: [];

	return {
		label: __('Position', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl
				breakpoint={deviceType}
				ignoreIndicator={ignoreIndicator}
			>
				<PositionControl
					{...getGroupAttributes(attributes, 'position')}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
				/>
			</ResponsiveTabsControl>
		),
		ignoreIndicator,
	};
};

export default position;
