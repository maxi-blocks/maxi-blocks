/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OpacityControl from '../opacity-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { opacity as opacityAttr } from '../../extensions/styles/defaults';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * Component
 */
const opacity = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	const extraIndicators = Object.keys(opacityAttr);

	return {
		label: __('Opacity', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl
				breakpoint={deviceType}
				extraIndicators={extraIndicators}
			>
				<OpacityControl
					opacity={getLastBreakpointAttribute({
						target: 'opacity',
						breakpoint: deviceType,
						attributes: getGroupAttributes(attributes, 'opacity'),
					})}
					onChange={val =>
						maxiSetAttributes({ [`opacity-${deviceType}`]: val })
					}
				/>
			</ResponsiveTabsControl>
		),
		extraIndicators,
	};
};

export default opacity;
