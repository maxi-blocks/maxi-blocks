/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PositionControl from '@components/position-control';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Component
 */
const position = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Position', 'maxi-blocks'),
		content: (
			<PositionControl
				{...getGroupAttributes(attributes, 'position')}
				onChange={obj => maxiSetAttributes(obj)}
				breakpoint={deviceType}
			/>
		),
	};
};

export default position;
