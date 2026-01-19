/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '@extensions/styles';
import ContextLoop from '@components/context-loop';

/**
 * Component
 */
const contextLoop = ({
	props: { clientId, attributes, maxiSetAttributes, deviceType, name },
	contentType,
}) => ({
	label: __('Context loop', 'maxi-blocks'),
	content: (
		<ContextLoop
			{...getGroupAttributes(attributes, 'contextLoop')}
			{...getGroupAttributes(attributes, 'dynamicContent')}
			clientId={clientId}
			contentType={contentType}
			onChange={obj => maxiSetAttributes(obj)}
			blockStyle={attributes?.blockStyle}
			breakpoint={deviceType}
			name={name}
		/>
	),
});

export default contextLoop;
