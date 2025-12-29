/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
// import ScrollEffectsControl from '@components/scroll-effects-control';
import { getGroupAttributes } from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import ContentLoader from '@components/content-loader';

const ScrollEffectsControl = lazy(() =>
	import(/* webpackChunkName: "maxi-scroll-effects" */ '@components/scroll-effects-control')
);

/**
 * Component
 */
const scrollEffects = ({ props, disabledInfoBox, depth = 2 }) => {
	const { attributes, maxiSetAttributes, blockStyle, clientId, deviceType } =
		props;

	const { uniqueID } = attributes;

	return {
		label: __('Scroll effects', 'maxi-blocks'),
		content: disabledInfoBox || (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<Suspense fallback={<ContentLoader />}>
					<ScrollEffectsControl
						uniqueID={uniqueID}
						{...getGroupAttributes(attributes, 'scroll')}
						onChange={obj => maxiSetAttributes(obj)}
						blockStyle={blockStyle}
						clientId={clientId}
						breakpoint={deviceType}
						depth={depth}
					/>
				</Suspense>
			</ResponsiveTabsControl>
		),
	};
};

export default scrollEffects;
