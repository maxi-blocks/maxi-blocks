/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '@extensions/styles';
import ContentLoader from '@components/content-loader';

const ContextLoop = lazy(() =>
	import(/* webpackChunkName: "maxi-context-loop" */ '@components/context-loop')
);

/**
 * Component
 */
const contextLoop = ({
	props: { clientId, attributes, maxiSetAttributes, deviceType, name },
	contentType,
}) => ({
	label: __('Context loop', 'maxi-blocks'),
	content: (
		<Suspense fallback={<ContentLoader />}>
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
		</Suspense>
	),
});

export default contextLoop;
