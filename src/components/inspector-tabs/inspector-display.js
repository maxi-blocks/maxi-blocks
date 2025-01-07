/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DisplayControl from '@components/display-control';
import { getGroupAttributes } from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const display = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Show/hide block', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<DisplayControl
					{...getGroupAttributes(attributes, 'display')}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
					defaultDisplay='flex'
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default display;
