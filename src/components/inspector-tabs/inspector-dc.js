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
const dc = ({
	props: { attributes, blockName, maxiSetAttributes },
	contentType,
}) => ({
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
			blockName={blockName}
			uniqueID={attributes.uniqueID}
			SVGData={attributes.SVGData}
			SVGElement={attributes.SVGElement}
			mediaID={attributes.mediaID}
			mediaURL={attributes.mediaURL}
		/>
	),
});

export default dc;
