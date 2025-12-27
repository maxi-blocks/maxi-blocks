/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Suspense, lazy } from '@wordpress/element';
import Spinner from '@components/spinner';
const ArrowControl = lazy(() => import(/* webpackChunkName: "maxi-arrow-settings" */ '@components/arrow-control'));
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const calloutArrow = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	const fullWidth = getLastBreakpointAttribute({
		target: 'full-width',
		breakpoint: deviceType,
		attributes,
	});

	return {
		label: __('Callout arrow', 'maxi-blocks'),
		content: () => (
			<Suspense fallback={<Spinner />}>
				<ResponsiveTabsControl breakpoint={deviceType}>
					<ArrowControl
						{...getGroupAttributes(attributes, [
							'blockBackground',
							'arrow',
							'border',
						])}
						onChange={obj => maxiSetAttributes(obj)}
						isFullWidth={fullWidth}
						breakpoint={deviceType}
					/>
				</ResponsiveTabsControl>
			</Suspense>
		),
		ignoreIndicatorGroups: ['border', 'blockBackground'],
	};
};

export default calloutArrow;
