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
			onChange={obj => {
				const filteredObj = Object.fromEntries(
					Object.entries(obj).filter(
						([key, value]) => value !== undefined
					)
				);
				maxiSetAttributes(filteredObj);
			}}
			contentType={contentType}
		/>
	),
});

export default dc;
