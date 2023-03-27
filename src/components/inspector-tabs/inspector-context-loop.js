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
const contextLoop = ({ props: { attributes, maxiSetAttributes } }) => ({
	label: __('Context loop', 'maxi-blocks'),
	content: (
		<ContextLoop
			{...getGroupAttributes(attributes, 'contextLoop')}
			onChange={obj => maxiSetAttributes(obj)}
		/>
	),
});

export default contextLoop;
