/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OpacityControl from '../opacity-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const opacity = ({ props }) => {
	const { attributes, deviceType, setAttributes } = props;

	return {
		label: __('Opacity', 'maxi-blocks'),
		content: (
			<OpacityControl
				{...getGroupAttributes(attributes, 'opacity')}
				onChange={obj => setAttributes(obj)}
				breakpoint={deviceType}
			/>
		),
	};
};

export default opacity;
