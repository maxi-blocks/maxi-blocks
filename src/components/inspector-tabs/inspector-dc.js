/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ContentLoader from '@components/content-loader';
const DynamicContent = lazy(() => import('@components/dynamic-content'));
import InfoBox from '@components/info-box';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Component
 */
const dc = ({
	props: { attributes, blockName, maxiSetAttributes },
	contentType,
}) => ({
	label: __('Dynamic content', 'maxi-blocks'),
	content: !attributes.isList ? (
		<Suspense fallback={<ContentLoader />}>
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
		</Suspense>
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
