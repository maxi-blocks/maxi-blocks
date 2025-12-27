/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Suspense, lazy } from '@wordpress/element';
import Spinner from '@components/spinner';
const ResponsiveControl = lazy(() => import(/* webpackChunkName: "maxi-responsive-settings" */ '@components/responsive-control'));
import { getGroupAttributes } from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const responsive = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Breakpoint', 'maxi-blocks'),
		content: () => (
			<Suspense fallback={<Spinner />}>
				<ResponsiveTabsControl breakpoint={deviceType}>
					<ResponsiveControl
						{...getGroupAttributes(attributes, 'breakpoints')}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
					/>
				</ResponsiveTabsControl>
			</Suspense>
		),
	};
};

export default responsive;
