/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ScrollEffectsControl from '../scroll-effects-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const scrollEffects = ({ props }) => {
	const { attributes, maxiSetAttributes, blockStyle, clientId, deviceType } =
		props;

	const { uniqueID } = attributes;

	return {
		label: __('Scroll effects', 'maxi-blocks'),
		content: (
			<ScrollEffectsControl
				uniqueID={uniqueID}
				{...getGroupAttributes(attributes, 'scroll')}
				onChange={obj => maxiSetAttributes(obj)}
				blockStyle={blockStyle}
				clientId={clientId}
				breakpoint={deviceType}
			/>
		),
	};
};

export default scrollEffects;
