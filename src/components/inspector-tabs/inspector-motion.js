/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MotionControl from '../motion-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const motion = ({ props }) => {
	const {
		attributes,
		setAttributes,
		uniqueID,
		blockStyle,
		clientId,
		deviceType,
	} = props;

	return {
		label: __('Motion Effects', 'maxi-blocks'),
		content: (
			<MotionControl
				uniqueID={uniqueID}
				{...getGroupAttributes(attributes, 'motion')}
				onChange={obj => setAttributes(obj)}
				blockStyle={blockStyle}
				clientId={clientId}
				breakpoint={deviceType}
			/>
		),
	};
};

export default motion;
