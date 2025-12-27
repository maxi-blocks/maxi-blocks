/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
// import AdvancedCssControl from '@components/advanced-css-control';
import { lazy, Suspense } from '@wordpress/element';
import ContentLoader from '@components/content-loader';
import { getAttributeKey, getGroupAttributes } from '@extensions/styles';

const AdvancedCssControl = lazy(() =>
	import(/* webpackChunkName: "maxi-advanced-css-control" */ '@components/advanced-css-control')
);

/**
 * Component
 */
const advancedCss = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Advanced CSS', 'maxi-blocks'),
		content: (
			<Suspense fallback={<ContentLoader />}>
				<AdvancedCssControl
					{...getGroupAttributes(attributes, 'advancedCss')}
					breakpoint={deviceType}
					onChange={value =>
						maxiSetAttributes({
							[getAttributeKey(
								'advanced-css',
								false,
								null,
								deviceType
							)]: value,
						})
					}
				/>
			</Suspense>
		),
	};
};

export default advancedCss;
