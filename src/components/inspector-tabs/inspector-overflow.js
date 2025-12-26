/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Suspense, lazy } from '@wordpress/element';
import Spinner from '@components/spinner';
const OverflowControl = lazy(() => import(/* webpackChunkName: "maxi-overflow-opt" */ '@components/overflow-control'));
import { getGroupAttributes } from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const overflow = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Overflow', 'maxi-blocks'),
		content: () => (
			<Suspense fallback={<Spinner />}>
				<ResponsiveTabsControl breakpoint={deviceType}>
					<OverflowControl
						{...getGroupAttributes(attributes, 'overflow')}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
					/>
				</ResponsiveTabsControl>
			</Suspense>
		),
	};
};

export default overflow;
