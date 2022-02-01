/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ZIndexControl from '../zindex-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const zindex = ({ props }) => {
	const { attributes, deviceType, handleSetAttributes } = props;

	return {
		label: __('Z-index', 'maxi-blocks'),
		content: (
			<ZIndexControl
				{...getGroupAttributes(attributes, 'zIndex')}
				onChange={obj => handleSetAttributes(obj)}
				breakpoint={deviceType}
			/>
		),
	};
};

export default zindex;
