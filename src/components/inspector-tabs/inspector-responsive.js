/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ResponsiveControl from '../responsive-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const responsive = ({ props }) => {
	const { attributes, deviceType, handleSetAttributes } = props;

	return {
		label: __('Breakpoint', 'maxi-blocks'),
		content: (
			<ResponsiveControl
				{...getGroupAttributes(attributes, 'breakpoints')}
				onChange={obj => handleSetAttributes(obj)}
				breakpoint={deviceType}
			/>
		),
	};
};

export default responsive;
