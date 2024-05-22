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
const InfoBox = loadable(() => import('../info-box'));
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const dc = ({
	props: { attributes, blockName, maxiSetAttributes },
	contentType,
}) => ({
	label: __('Dynamic content', 'maxi-blocks'),
	content: !attributes.isList ? (
		<DynamicContent
			{...getGroupAttributes(attributes, 'dynamicContent')}
			onChange={maxiSetAttributes}
			contentType={contentType}
			blockName={blockName}
			uniqueID={attributes.uniqueID}
			SVGData={attributes.SVGData}
			SVGElement={attributes.SVGElement}
			mediaID={attributes.mediaID}
			mediaURL={attributes.mediaURL}
		/>
	) : (
		<InfoBox
			message={__(
				'Dynamic content is not available for lists.',
				'maxi-blocks'
			)}
		/>
	),
});

export default dc;
