/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Suspense, lazy } from '@wordpress/element';
import Spinner from '@components/spinner';
const ZIndexControl = lazy(() => import(/* webpackChunkName: "maxi-zindex-stack" */ '@components/zindex-control'));
import { getGroupAttributes } from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const zindex = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Z-index', 'maxi-blocks'),
		content: () => (
			<Suspense fallback={<Spinner />}>
				<ResponsiveTabsControl breakpoint={deviceType}>
					<ZIndexControl
						{...getGroupAttributes(attributes, 'zIndex')}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
					/>
				</ResponsiveTabsControl>
			</Suspense>
		),
	};
};

export default zindex;
