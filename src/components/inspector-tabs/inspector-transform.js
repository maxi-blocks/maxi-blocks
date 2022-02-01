/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransformControl from '../transform-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const transform = ({ props }) => {
	const { attributes, deviceType, uniqueID, handleSetAttributes } = props;

	return {
		label: __('Transform', 'maxi-blocks'),
		content: (
			<TransformControl
				{...getGroupAttributes(attributes, 'transform')}
				onChange={obj => handleSetAttributes(obj)}
				uniqueID={uniqueID}
				breakpoint={deviceType}
			/>
		),
	};
};

export default transform;
