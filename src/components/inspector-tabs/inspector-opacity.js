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

/**
 * Component
 */
const opacity = ({ props }) => {
	const { attributes, deviceType, setAttributes } = props;

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
					setAttributes({ [`opacity-${deviceType}`]: val })
				}
			/>
		),
	};
};

export default opacity;
