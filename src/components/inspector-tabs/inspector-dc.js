/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DynamicContent from '../dynamic-content';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const dc = ({ props: { attributes, maxiSetAttributes } }) => ({
	label: __('Dynamic content', 'maxi-blocks'),
	content: (
		<DynamicContent
			{...getGroupAttributes(attributes, 'dynamicContent')}
			onChange={obj => maxiSetAttributes(obj)}
			allowCustomDate
		/>
	),
});

export default dc;
