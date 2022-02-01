/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OverflowControl from '../overflow-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const overflow = ({ props }) => {
	const { attributes, deviceType, handleSetAttributes } = props;

	return {
		label: __('Overflow', 'maxi-blocks'),
		content: (
			<OverflowControl
				{...getGroupAttributes(attributes, 'overflow')}
				onChange={obj => handleSetAttributes(obj)}
				breakpoint={deviceType}
			/>
		),
	};
};

export default overflow;
