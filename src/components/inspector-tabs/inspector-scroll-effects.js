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
const scrollEffects = ({ props, depth }) => {
	const { attributes, setAttributes, blockStyle, clientId, deviceType } =
		props;

	const { uniqueID } = attributes;

	return {
		label: __('Scroll effects', 'maxi-blocks'),
		content: (
			<ScrollEffectsControl
				uniqueID={uniqueID}
				{...getGroupAttributes(attributes, 'scroll')}
				onChange={obj => setAttributes(obj)}
				blockStyle={blockStyle}
				clientId={clientId}
				breakpoint={deviceType}
				depth={depth}
			/>
		),
	};
};

export default scrollEffects;
