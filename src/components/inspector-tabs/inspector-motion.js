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
	const { attributes, setAttributes, blockStyle, clientId, deviceType } =
		props;

	const { uniqueID } = attributes;

	console.log('uniqueID');
	console.log(uniqueID);

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
