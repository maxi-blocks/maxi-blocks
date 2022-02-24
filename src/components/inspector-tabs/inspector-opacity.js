/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OpacityControl from '../opacity-control';
import ResponsiveTabsControl from '../responsive-tabs-control';

import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { opacity as opacityAttr } from '../../extensions/styles/defaults';

/**
 * Component
 */
const opacity = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Opacity', 'maxi-blocks'),
		content: (
			<>
				<ResponsiveTabsControl
					{...getGroupAttributes(attributes, 'opacity')}
					breakpoint={deviceType}
				/>
				<OpacityControl
					opacity={getLastBreakpointAttribute(
						'opacity',
						deviceType,
						getGroupAttributes(attributes, 'opacity')
					)}
					onChange={val =>
						maxiSetAttributes({ [`opacity-${deviceType}`]: val })
					}
				/>
			</>
		),
		extraIndicators: Object.keys(opacityAttr),
	};
};

export default opacity;
