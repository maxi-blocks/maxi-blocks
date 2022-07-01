/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ArrowControl from '../arrow-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getIgnoreIndicator } from '../../extensions/indicators';
import ResponsiveTabsControl from '../responsive-tabs-control';

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

	const ignoreIndicator = getIgnoreIndicator({
		attributes,
		ignoreGroupAttributes: ['blockBackground', 'arrow', 'border'],
		target: 'arrow-status',
		valueToCompare: false,
	});

	return {
		label: __('Callout arrow', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl
				breakpoint={deviceType}
				ignoreIndicator={ignoreIndicator}
			>
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
		ignoreIndicator,
		ignoreIndicatorGroups: ['border', 'blockBackground'],
	};
};

export default calloutArrow;
