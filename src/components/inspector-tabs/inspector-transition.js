/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransitionControl from '../transition-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const transition = ({ props, label = '' }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label,
		content: (
			<>
				<ResponsiveTabsControl
					{...getGroupAttributes(attributes, 'transitionDuration')}
					breakpoint={deviceType}
				/>
				<TransitionControl
					{...getGroupAttributes(attributes, 'transitionDuration')}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
				/>
			</>
		),
	};
};

export default transition;
