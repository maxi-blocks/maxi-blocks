/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransformControl from '../transform-control';
import { getGroupAttributes } from '../../extensions/styles';
import getActiveAttributes from '../../extensions/active-indicators';

/**
 * Component
 */
const transform = ({ props }) => {
	const { attributes, deviceType, uniqueID, setAttributes } = props;

	return {
		label: __('Transform', 'maxi-blocks'),
		content: (
			<TransformControl
				{...getGroupAttributes(attributes, 'transform')}
				onChange={obj => setAttributes(obj)}
				uniqueID={uniqueID}
				breakpoint={deviceType}
				active={getActiveAttributes(
					getGroupAttributes(attributes, 'transform'),
					'transform'
				)}
			/>
		),
	};
};

export default transform;
