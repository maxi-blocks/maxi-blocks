/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../../extensions/styles';
import { ContextLoop } from '..';

/**
 * Component
 */
const contextLoop = ({
	props: { clientId, attributes, maxiSetAttributes },
	contentType,
}) => ({
	label: __('Context loop', 'maxi-blocks'),
	content: (
		<ContextLoop
			{...getGroupAttributes(attributes, 'contextLoop')}
			clientId={clientId}
			contentType={contentType}
			onChange={obj => maxiSetAttributes(obj)}
		/>
	),
});

export default contextLoop;
