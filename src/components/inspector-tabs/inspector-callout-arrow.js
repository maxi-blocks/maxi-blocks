/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ArrowControl from '@components/arrow-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const calloutArrow = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	const fullWidth = getLastBreakpointAttribute({
		target: 'full-width',
		breakpoint: deviceType,
		attributes,
	});

	return {
		label: __('Callout arrow', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<ArrowControl
					{...getGroupAttributes(attributes, [
						'blockBackground',
						'arrow',
						'border',
					])}
					onChange={obj => maxiSetAttributes(obj)}
					isFullWidth={fullWidth}
					breakpoint={deviceType}
				/>
			</ResponsiveTabsControl>
		),
		ignoreIndicatorGroups: ['border', 'blockBackground'],
	};
};

export default calloutArrow;
