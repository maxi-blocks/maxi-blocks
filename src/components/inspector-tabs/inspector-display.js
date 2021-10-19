/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DisplayControl from '../display-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const display = ({ props }) => {
	const { attributes, deviceType, setAttributes } = props;

	return {
		label: __('Show/hide block', 'maxi-blocks'),
		content: (
			<DisplayControl
				{...getGroupAttributes(attributes, 'display')}
				onChange={obj => setAttributes(obj)}
				breakpoint={deviceType}
				defaultDisplay='flex'
			/>
		),
	};
};

export default display;
