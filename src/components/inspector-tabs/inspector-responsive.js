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
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Breakpoint', 'maxi-blocks'),
		content: (
			<ResponsiveControl
				{...getGroupAttributes(attributes, 'breakpoints')}
				onChange={obj => maxiSetAttributes(obj)}
				breakpoint={deviceType}
			/>
		),
	};
};

export default responsive;
