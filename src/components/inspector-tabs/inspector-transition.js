/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransitionControl from '../transition-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const transition = ({ props, label = __('Hover transition', 'maxi-blocks') }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label,
		content: (
			<TransitionControl
				{...getGroupAttributes(attributes, 'transition')}
				onChange={obj => maxiSetAttributes(obj)}
				breakpoint={deviceType}
			/>
		),
	};
};

export default transition;
