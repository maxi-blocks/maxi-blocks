/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Repeater from '@components/repeater';
import { getGroupAttributes } from '@extensions/styles';

const repeater = ({
	props: { attributes, clientId, deviceType, maxiSetAttributes },
	isRepeaterInherited,
	updateInnerBlocksPositions,
}) =>
	deviceType === 'general' && {
		label: __('Repeater', 'maxi-blocks'),
		content: (
			<Repeater
				{...getGroupAttributes(attributes, 'repeater')}
				clientId={clientId}
				isRepeaterInherited={isRepeaterInherited}
				updateInnerBlocksPositions={updateInnerBlocksPositions}
				onChange={maxiSetAttributes}
			/>
		),
	};

export default repeater;
