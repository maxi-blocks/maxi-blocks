/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ResponsiveControl from '@components/responsive-control';
import { getGroupAttributes } from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const responsive = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Breakpoint', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<ResponsiveControl
					{...getGroupAttributes(attributes, 'breakpoints')}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default responsive;
