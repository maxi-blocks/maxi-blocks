/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ContentLoader from '@components/content-loader';
import { getLastBreakpointAttribute } from '@extensions/styles';
import { getSelectorsCss, getCategoriesCss } from '@components/custom-css-control/utils';

const CustomCssControl = lazy(() =>
	import(/* webpackChunkName: "maxi-custom-css-control" */ '@components/custom-css-control')
);

/**
 * Component
 */
const customCss = ({
	props,
	breakpoint = 'general',
	selectors,
	categories,
}) => {
	const { attributes, maxiSetAttributes } = props;

	const customCssValue = getLastBreakpointAttribute({
		target: 'custom-css',
		breakpoint,
		attributes,
	});
	const customCssCategory = attributes['custom-css-category'];

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<Suspense fallback={<ContentLoader />}>
				<CustomCssControl
					breakpoint={breakpoint}
					categories={getCategoriesCss(categories, attributes)}
					category={customCssCategory}
					selectors={getSelectorsCss(selectors, attributes)}
					value={customCssValue}
					onChange={(attr, val) =>
						maxiSetAttributes({
							[attr]: val,
						})
					}
				/>
			</Suspense>
		),
		extraIndicators: [`custom-css-${breakpoint}`],
	};
};

export default customCss;
