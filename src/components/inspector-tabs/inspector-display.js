/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Suspense, lazy } from '@wordpress/element';
import Spinner from '@components/spinner';
const DisplayControl = lazy(() => import(/* webpackChunkName: "maxi-display-layout" */ '@components/display-control'));
import { getGroupAttributes } from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const display = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Show/hide block', 'maxi-blocks'),
		content: () => (
			<Suspense fallback={<Spinner />}>
				<ResponsiveTabsControl breakpoint={deviceType}>
					<DisplayControl
						{...getGroupAttributes(attributes, 'display')}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
						defaultDisplay='flex'
					/>
				</ResponsiveTabsControl>
			</Suspense>
		),
	};
};

export default display;
