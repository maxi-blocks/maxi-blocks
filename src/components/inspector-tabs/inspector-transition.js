/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransitionControl from '../transition-control';
import { getGroupAttributes } from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * Component
 */
const transition = ({ props, label = '' }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label,
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<TransitionControl
					{...getGroupAttributes(attributes, 'transitionDuration')}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default transition;
