/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const DynamicContent = loadable(() => import('../dynamic-content'));
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const dc = ({ props: { attributes, maxiSetAttributes }, contentType }) => ({
	label: __('Dynamic content', 'maxi-blocks'),
	content: (
		<DynamicContent
			{...getGroupAttributes(attributes, 'dynamicContent')}
			onChange={obj => maxiSetAttributes(obj)}
			contentType={contentType}
		/>
	),
});

export default dc;
