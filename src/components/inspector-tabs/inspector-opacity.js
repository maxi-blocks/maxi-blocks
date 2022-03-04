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

/**
 * Component
 */
const opacity = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Opacity', 'maxi-blocks'),
		content: (
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
		),
		extraIndicators: Object.keys(opacityAttr),
	};
};

export default opacity;
