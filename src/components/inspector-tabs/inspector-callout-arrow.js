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

	const ignoreIndicator =
		!attributes[`arrow-status-${deviceType}`] &&
		Object.keys(
			getGroupAttributes(attributes, [
				'blockBackground',
				'arrow',
				'border',
			])
		);

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
