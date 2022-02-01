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
	const { attributes, deviceType, handleSetAttributes } = props;

	return {
		label: __('Opacity', 'maxi-blocks'),
		content: (
			<OpacityControl
				opacity={getLastBreakpointAttribute(
					'opacity',
					deviceType,
					getGroupAttributes(attributes, 'opacity')
				)}
				onChange={val =>
					handleSetAttributes({ [`opacity-${deviceType}`]: val })
				}
			/>
		),
		extraIndicators: Object.keys(opacityAttr),
	};
};

export default opacity;
