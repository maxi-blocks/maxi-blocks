/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PositionControl from '../position-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const position = ({ props }) => {
	const { attributes, deviceType, handleSetAttributes } = props;

	return {
		label: __('Position', 'maxi-blocks'),
		content: (
			<PositionControl
				{...getGroupAttributes(attributes, 'position')}
				onChange={obj => handleSetAttributes(obj)}
				breakpoint={deviceType}
			/>
		),
	};
};

export default position;
