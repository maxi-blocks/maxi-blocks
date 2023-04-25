/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Repeater from '../repeater';
import { getGroupAttributes } from '../../extensions/styles';

const repeater = ({
	props: { attributes, clientId, maxiSetAttributes },
	columnRefClientId,
}) => ({
	label: __('Repeater', 'maxi-blocks'),
	content: (
		<Repeater
			{...getGroupAttributes(attributes, 'repeater')}
			clientId={clientId}
			columnRefClientId={columnRefClientId}
			onChange={maxiSetAttributes}
		/>
	),
});

export default repeater;
