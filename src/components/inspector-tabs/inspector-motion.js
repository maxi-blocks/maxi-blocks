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
	const { attributes, setAttributes } = props;

	return {
		label: __('Motion effect', 'maxi-blocks'),
		content: (
			<MotionControl
				{...getGroupAttributes(attributes, 'motion')}
				onChange={obj => setAttributes(obj)}
			/>
		),
	};
};

export default motion;
